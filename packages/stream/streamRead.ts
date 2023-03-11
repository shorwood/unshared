/* eslint-disable sonarjs/cognitive-complexity */
import { nextTick } from 'node:process'
import { Readable } from 'node:stream'

export interface ToBufferOptions<T extends BufferEncoding | undefined = BufferEncoding | undefined> {
  /**
   * The encoding to use. If not specified, a `Buffer` is returned.
   *
   * @example "utf8"
   */
  encoding?: T
  /**
   * The length of the buffer to return. If not specified, the entire stream is buffered.
   *
   * Specifying a length prevents the function from reallocating memory for each chunk. It lets
   * us allocate a single buffer of the specified length and copy the stream into it.
   *
   * @example 1024
   */
  length?: number
}

/**
 * Reads a stream into a buffer.
 *
 * @param stream The stream to read.
 * @returns A promise that resolves with the buffer.
 * @example streamRead(fs.createReadStream('file.txt')) // Promise<Buffer>
 */
export function streamRead(stream: Readable): Promise<Buffer>
/**
 * Reads a stream into an encoded string.
 *
 * @param stream The stream to read.
 * @param encoding The encoding to use. If not specified, a `Buffer` is returned.
 * @returns A promise that resolves with the encoded string.
 * @example streamRead(fs.createReadStream('file.txt'), 'utf8') // Promise<string>
 */
export function streamRead(stream: Readable, encoding: BufferEncoding): Promise<string>
/**
 * Reads a stream into an encoded string.
 *
 * @param stream The stream to read.
 * @param length The length of the buffer to return. If not specified, the entire stream is buffered.
 * @returns A promise that resolves with the buffer.
 * @example streamRead(fs.createReadStream('file.txt'), 1024) // Promise<Buffer>
 */
export function streamRead(stream: Readable, length: number): Promise<Buffer>
/**
 * Reads a stream into a buffer.
 *
 * @param stream The stream to read.
 * @param options The options to use.
 * @returns A promise that resolves with the buffer.
 * @example streamRead(fs.createReadStream('file.txt'), { length: 1024 }) // Promise<Buffer>
 */
export async function streamRead(stream: Readable, options: ToBufferOptions<undefined>): Promise<Buffer>
/**
 * Reads a stream into an encoded string.
 *
 * @param stream The stream to read.
 * @param options The options to use.
 * @returns A promise that resolves with the encoded string.
 * @example streamRead(fs.createReadStream('file.txt'), { encoding: 'utf8' }) // Promise<string>
 */
export async function streamRead(stream: Readable, options: ToBufferOptions<BufferEncoding>): Promise<string>
/**
 * Reads a stream into a buffer or an encoded string.
 *
 * @param stream The stream to read.
 * @param options The options to use.
 * @returns A promise that resolves with the buffer or encoded string.
 * @example streamRead(fs.createReadStream('file.txt'), { encoding: 'utf8' }) // Promise<string>
 */
export async function streamRead(stream: Readable, options?: number | BufferEncoding | ToBufferOptions): Promise<Buffer | string>
export async function streamRead(stream: Readable, options?: number | BufferEncoding | ToBufferOptions): Promise<Buffer | string> {
  // --- Decompose the parameters and options.
  if (typeof options === 'string') options = { encoding: options }
  if (typeof options === 'number') options = { length: options }
  const { encoding, length } = options ?? {}

  if (stream instanceof Readable === false)
    throw new TypeError('Expected a Readable stream.')
  if (stream.readableEnded)
    throw new Error('Readable has already ended.')
  if (length !== undefined && typeof length !== 'number')
    throw new TypeError('Expected a number for the length.')
  if (length !== undefined && length < 0)
    throw new RangeError('Received a negative length.')

  // --- Reads the stream into a buffer of fixed length.
  if (length) {
    let index = 0
    const buffer = Buffer.allocUnsafe(length)
    while (index < length) {
      const readLength = Math.min(length - index, stream.readableHighWaterMark)
      const chunk = stream.read(readLength) as Buffer | string | null

      // --- If the stream ended, throw an error.
      if (chunk === null)
        throw new Error(`Expected a stream of length ${length} but received ${index} bytes.`)

      // --- Copy the chunk into the buffer.
      const readChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk ?? '')
      readChunk.copy(buffer, index, 0, readLength)
      index += readLength

      // --- If the chunk was too long, unshift the remainder back into the stream.
      if (readLength < readChunk.length) {
        const remainder = readChunk.subarray(readLength)
        stream.unshift(remainder)
        break
      }

      // --- Wait for the next tick to avoid blocking the event loop.
      await new Promise(nextTick)
    }

    // --- Return the buffer or encoded string.
    return encoding ? buffer.toString(encoding) : buffer
  }

  // --- Consumes the stream into a buffer of variable length.
  let index = 0
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    const chunkBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    chunks.push(chunkBuffer)
    index += chunk.length
  }
  const buffer = Buffer.concat(chunks, index)
  return encoding ? buffer.toString(encoding) : buffer
}

/* c8 ignore next */
if (import.meta.vitest) {
  const string = 'Hello, world!'
  const buffer = Buffer.from(string)

  it.each([string, buffer])('should read a stream into a buffer from %o', async(input) => {
    const stream = Readable.from(input)
    const result = await streamRead(stream)
    expect(result).toEqual(buffer)
    expectTypeOf(result).toEqualTypeOf<Buffer>()
  })

  it.each([string, buffer])('should read a stream into an encoded string from %o', async(input) => {
    const stream = Readable.from(input)
    const result = await streamRead(stream, 'utf8')
    expect(result).toEqual(string)
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  it.each([string, buffer])('should read a stream into a buffer with a length from %o', async(input) => {
    const stream = Readable.from(input)
    const result = await streamRead(stream, 5)
    const expected = buffer.subarray(0, 5)
    expect(result).toEqual(expected)
    expectTypeOf(result).toEqualTypeOf<Buffer>()
  })

  it.each([string, buffer])('should read only the necessary bytes from %o without consuming the rest', async(input) => {
    const stream = Readable.from(input)
    const result1 = await streamRead(stream, { length: 5, encoding: 'utf8' })
    const result2 = await streamRead(stream, { length: 5, encoding: 'utf8' })
    const expected1 = buffer.subarray(0, 5).toString('utf8')
    const expected2 = buffer.subarray(5, 10).toString('utf8')
    expect(result1).toEqual(expected1)
    expect(result2).toEqual(expected2)
  })

  it.each([string, buffer])('should read a stream into an encoded string with a length from %o', async(input) => {
    const stream = Readable.from(input)
    const result = await streamRead(stream, { length: 5, encoding: 'utf8' })
    const expected = string.slice(0, 5)
    expect(result).toEqual(expected)
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  it.each([string, buffer])('should throw if the length is out of bounds', async(input) => {
    const stream = Readable.from(input)
    const shouldReject = () => streamRead(stream, { length: 100 })
    await expect(shouldReject).rejects.toThrow(Error)
  })

  it('should throw if the stream has already ended', async() => {
    const stream = Readable.from(string)
    stream.destroy()
    const shouldReject = () => streamRead(stream)
    await expect(shouldReject).rejects.toThrow(Error)
  })

  it('should throw if the stream is not a Readable', async() => {
    // @ts-expect-error: invalid type
    const shouldReject = () => streamRead('not-stream')
    await expect(shouldReject).rejects.toThrow(TypeError)
  })

  it('should throw if the length is not a number', async() => {
    const stream = Readable.from(string)
    // @ts-expect-error: invalid type
    const shouldReject = () => streamRead(stream, { length: 'foo' })
    await expect(shouldReject).rejects.toThrow(TypeError)
  })

  it('should throw if the length is negative', async() => {
    const stream = Readable.from(string)
    const shouldReject = () => streamRead(stream, { length: -1 })
    await expect(shouldReject).rejects.toThrow(RangeError)
  })
}
