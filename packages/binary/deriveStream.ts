import { Transform, Readable } from 'node:stream'
import { awaitable, Awaitable } from '@unshared/functions/awaitable'
import { streamRead } from './streamRead'

/** Callback that is executed with the stream chunks. */
export type DeriveStreamFunction<T> = (value: { chunk: Buffer; encoding: BufferEncoding; value: T }) => T

/** A transform stream that derives a value from the stream chunks. */
class Derive<T = unknown> extends Transform {
  /**
   * Create a transform stream that derives a value from the stream chunks.
   * The chunks are passed-through to the stream, and the derived value is
   * resolved once the stream has been consumed.
   *
   * @param derive The callback to execute with the stream chunks.
   * @param value The initial value of the derived value.
   * @example
   * const stream = fs.createReadStream('file.txt')
   * const length = new Derive(({ chunk, value }) => value + chunk.length, 0)
   *
   * // Pipe the stream to a file.
   * const writeStream = fs.createWriteStream('file.txt')
   * stream.pipe(writeStream)
   *
   * // Once the stream has been consumed, get the length of the file.
   * const length = await length.finalValue // 13
   */
  constructor(private readonly derive: DeriveStreamFunction<T>, private value: T) {
    super()

    // --- Initialize a promise that can be resolved from outside the constructor.
    this.finalValue = new Promise(resolve => this.resolveDerivedValue = resolve)
  }

  /** The chunks read from the stream. */
  private resolveDerivedValue!: (value: T) => void

  /** Promise that resolves to the value returned from the callback. */
  public finalValue: Promise<T>

  // --- Intercepts the chunks read from the stream and executes the callback.
  override _transform(chunk: Buffer, encoding: BufferEncoding, callback: () => void) {
    this.value = this.derive({ chunk, encoding, value: this.value })
    this.push(chunk, encoding)
    callback()
  }

  // --- Resolves the promise once the stream has been consumed.
  override _final(callback: () => void) {
    this.resolveDerivedValue(this.value)
    callback()
  }
}

/**
 * Derive a value from a stream of bytes without consuming the stream. This
 * function will intercept the chunks read from subsequent calls to `read()`,
 * execute the given callback, and then pass the chunks back into the stream.
 *
 * This function returns an `Awaitable` value, which means that the synchronous
 * value is the stream itself, and the asynchronous value is the value returned
 * from the callback once the stream has been consumed.
 *
 * This function is useful for computing checksums, digests, and other values
 * from a stream without consuming the stream. For example, you can pipe the
 * stream to a file, and then get the checksum once the stream has been consumed
 * without having to buffer the entire stream in memory.
 *
 * @param derive The callback to execute with the stream chunks.
 * @param initialValue The initial value of the derived value.
 * @returns A promise that resolves to the value returned from the callback.
 * @example
 * const stream = fs.createReadStream('file.txt')
 * const derivedLength = deriveStream(({ chunk, value }) => value + chunk.length, 0)
 * stream.pipe(derivedLength)
 *
 * // Pipe the stream to a file.
 * const writeStream = fs.createWriteStream('file.txt')
 * stream.pipe(writeStream)
 *
 * // Once the stream has been consumed, get the length of the file.
 * const length = await derivedLength // 13
 */
export function deriveStream<T>(derive: DeriveStreamFunction<T>, initialValue: T): Awaitable<Transform, T> {
  const stream = new Derive(derive, initialValue)
  return awaitable(stream, () => stream.finalValue)
}

/* c8 ignore next */
if (import.meta.vitest) {
  const valueUtf8 = 'Hello, world!'
  const valueBuffer = Buffer.from(valueUtf8, 'utf8')

  it('should not consume the stream chunks', async() => {
    const stream = Readable.from(valueBuffer)
    const derivedLength = deriveStream(({ chunk, value }) => value + chunk.length, 0)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    stream.pipe(derivedLength)
    const buffer = await streamRead(derivedLength, 'utf8')
    expect(buffer).toEqual(valueUtf8)
  })

  it('should derive a value from the stream chunks', async() => {
    const stream = Readable.from(valueBuffer)
    const derivedLength = deriveStream(({ chunk, value }) => value + chunk.length, 0)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    stream.pipe(derivedLength)
    const length = await derivedLength
    expect(length).toEqual(13)
  })
}
