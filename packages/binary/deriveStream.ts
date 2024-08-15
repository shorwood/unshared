import type { Awaitable } from '@unshared/functions/awaitable'
import { awaitable } from '@unshared/functions/awaitable'
import { Readable, Transform } from 'node:stream'

/** Callback that is executed with the stream chunks. */
export type DeriveStreamFunction<T> = (value: { chunk: Buffer; encoding: BufferEncoding; value: T }) => T

/** A transform stream that derives a value from the stream chunks. */
export class Derive<T = unknown> extends Transform {

  /** The chunks read from the stream. */
  private resolveDerivedValue!: (value: T) => void

  /** Promise that resolves to the value returned from the callback. */
  public value: Promise<T>

  /**
   * Create a transform stream that derives a value from the stream chunks.
   * The chunks are passed-through to the stream, and the derived value is
   * resolved once the stream has been consumed.
   *
   * @param derive The callback to execute with the stream chunks.
   * @param _value The initial value of the derived value.
   * @example
   * const stream = fs.createReadStream('file.txt')
   * const length = new Derive(({ chunk, value }) => value + chunk.length, 0)
   *
   * // Pipe the stream to a file.
   * const writeStream = fs.createWriteStream('file.txt')
   * stream.pipe(writeStream)
   *
   * // Once the stream has been consumed, get the length of the file.
   * const length = await length.value // 13
   */
  constructor(private readonly derive: DeriveStreamFunction<T>, private _value: T) {
    super()

    // --- Initialize a promise that can be resolved from outside the constructor.
    this.value = new Promise(resolve => this.resolveDerivedValue = resolve)
  }

  // --- Resolves the promise once the stream has been consumed.
  override _final(callback: () => void) {
    this.resolveDerivedValue(this._value)
    callback()
  }

  // --- Intercepts the chunks read from the stream and executes the callback.
  override _transform(chunk: Buffer, encoding: BufferEncoding, callback: () => void) {
    this._value = this.derive({ chunk, encoding, value: this._value })
    this.push(chunk, encoding)
    callback()
  }
}

/**
 * Derive a value from a stream of bytes without consuming the data. This
 * function will intercept the chunks read from subsequent calls to `read()`,
 * execute the given callback, and then pass the chunks back into the stream.
 *
 * This function returns an `Awaitable` value, which means that the synchronous
 * value is the `Derive` stream itself, and the asynchronous value is the value
 * returned from the callback once the stream has been consumed by an external
 * consumer.
 *
 * This function is useful for computing checksums, digests, and other values
 * from a stream without consuming it. For example, you can pipe the stream to
 * a file while simultaneously computing the length, hash, or other value,
 * without having to buffer the entire stream in memory.
 *
 * @param derive The callback to execute with the stream chunks.
 * @param initialValue The initial value of the derived value.
 * @returns A promise that resolves to the value returned from the callback.
 * @example
 * const stream = fs.createReadStream('file.txt')
 * const derivedHash = deriveStream(({ chunk, value }) => { hash.update(chunk); return hash }, createHash('sha256'))
 * const derivedLength = deriveStream(({ chunk, value }) => value + chunk.length, 0)
 *
 * // Pipe the stream to a file.
 * const writeStream = fs.createWriteStream('file.txt')
 * stream.pipe(derivedHash).pipe(derivedLength).pipe(writeStream)
 *
 * // Once the stream has been consumed, extract the hash and length.
 * const hash = await derivedHash.then(hash => hash.digest('hex'))
 * const length = await derivedLength
 */
export function deriveStream<T>(derive: DeriveStreamFunction<T>, initialValue: T): Awaitable<Derive, T> {
  const stream = new Derive(derive, initialValue)
  return awaitable(stream, () => stream.value) as Awaitable<Derive, T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should synchroneously return the initial stream value', () => {
    const result = deriveStream(({ value }) => value, 42)
    expect(result).toBeInstanceOf(Derive)
  })

  test('should derive a value from the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const result = deriveStream(({ chunk, value }) => value + chunk.length, 0)
    void stream.pipe(result)
    const length = await result
    expect(length).toBe(13)
  })

  test('should not consume the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const result = deriveStream(({ chunk, value }) => value + chunk.length, 0)
    void stream.pipe(result)
    const chunks = await result.toArray()
    const buffer = Buffer.concat(chunks).toString('utf8')
    expect(buffer).toBe('Hello, world!')
  })
}
