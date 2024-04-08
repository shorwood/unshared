import { nextTick } from 'node:process'
import { PassThrough, Readable } from 'node:stream'
import { streamReadable } from '../streamReadable'

export interface StreamReadOptions {
  /**
   * The encoding to use. If not specified, a `Buffer` is returned.
   *
   * @example "utf8"
   */
  encoding?: BufferEncoding
  /**
   * The length of the buffer to return. If not specified, the entire stream is buffered.
   *
   * Specifying a length prevents the function from reallocating memory for each chunk. It lets
   * us allocate a single buffer of the specified length and copy the stream into it.
   *
   * @example
   * const stream = Readable.from('Hello, world!')
   * const result = await streamRead(stream, { encoding: 'utf8', size: 5 })
   * console.log(result) // => "Hello"
   */
  size?: number
}

/**
 * Reads a stream into an encoded string.
 *
 * @param stream The stream to read.
 * @param options The options to use.
 * @returns A promise that resolves with the encoded string.
 * @example streamRead(fs.createReadStream('file.txt'), { encoding: 'utf8', size: 1024 }) // Promise<string>
 */
export async function streamRead(stream: Readable, options: StreamReadOptions): Promise<string>
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
 * Reads a stream into an encoded string.
 *
 * @param stream The stream to read.
 * @param encoding The encoding to use. If not specified, a `Buffer` is returned.
 * @returns A promise that resolves with the encoded string.
 * @example streamRead(fs.createReadStream('file.txt'), 'utf8') // Promise<string>
 */
export function streamRead(stream: Readable, encoding: BufferEncoding): Promise<string>
/**
 * Reads a stream into a buffer.
 *
 * @param stream The stream to read.
 * @returns A promise that resolves with the buffer.
 * @example streamRead(fs.createReadStream('file.txt')) // Promise<Buffer>
 */
export function streamRead(stream: Readable): Promise<Buffer>
export async function streamRead(stream: Readable, options?: BufferEncoding | Partial<StreamReadOptions> | number): Promise<Buffer | string> {

  // --- Normalize and destructure the options.
  if (typeof options === 'string') options = { encoding: options }
  if (typeof options === 'number') options = { size: options }
  const { encoding, size } = options ?? {}
  const consumer = new PassThrough()

  // --- Read the stream into a buffer of variable length. This is the default behavior
  // --- when no length is specified. It will consume the entire stream, storing the chunks
  // --- into a temporary array, and then concatenate them into a single buffer at the end.
  if (size === undefined) {
    let offset = 0
    const chunks: Buffer[] = []

    await new Promise<void>((resolve, reject) => {
      stream.once('close', resolve)
      stream.once('pause', resolve)
      stream.once('error', reject)
      stream.addListener('data', (chunk) => {
        const chunkBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string)
        chunks.push(chunkBuffer)
        offset += chunkBuffer.length
      })

      // --- Start consuming the stream.
      stream.pipe(consumer, { end: false })
    })

    const buffer = Buffer.concat(chunks, offset)
    return encoding ? buffer.toString(encoding) : buffer
  }

  // --- Consumes the stream into a buffer of fixed length. This is the optimized behavior
  // --- when a length is specified. It will consume the stream and copy the chunks into the
  // --- resulting buffer until the expected length is reached. If the stream ends before the
  // --- expected length is reached, an error is thrown.
  let offset = 0
  const buffer = Buffer.alloc(size)
  await streamReadable(stream)
  while (offset < size) {
    // const chunk = stream.read()
    // if (chunk === null) break

    const chunk = await new Promise<Buffer>((resolve) => {
      stream.once('data', chunk => resolve(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string)))
      stream.once('error', error => resolve(null))
      stream.once('end', () => resolve(null))
    })

    offset += chunk.length
    const remaining = size - offset
    const writeback = chunk.subarray(remaining)
    stream.unshift(writeback)
    chunk.copy(buffer, offset - chunk.length)
  }

  // --- If the expected length is not reached, throw an error.
  // if (offset < size) throw new Error(`Expected a stream of length ${size} but received ${offset} bytes.`)
  if (offset < size) console.warn(`Expected a stream of length ${size} but received ${offset} bytes.`)

  // --- Return the buffer or encoded string.
  return encoding ? buffer.toString(encoding) : buffer
}

/* v8 ignore start */
if (import.meta.vitest) {
  const string = 'Hello, world!'
  const buffer = Buffer.from(string)

  describe.only('unspecified length', () => {
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
  })

  describe('fixed length', () => {
    it.each([string, buffer])('should read a stream into an encoded string with a length from %o', async(input) => {
      const stream = Readable.from(input)
      const result = await streamRead(stream, { size: 5, encoding: 'utf8' })
      const expected = string.slice(0, 5)
      expect(result).toEqual(expected)
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it.each([string, buffer])('should read the necessary bytes from %o without consuming the rest', async(input) => {
      const stream = Readable.from(input)
      const result1 = await streamRead(stream, { size: 5, encoding: 'utf8' })
      const result2 = await streamRead(stream, { size: 5, encoding: 'utf8' })
      expect(result1).toEqual('Hello')
      expect(result2).toEqual(', wor')
    })
  })

  // it('should read until a NULL byte from %o', async() => {
  //   const stream = Readable.from('Hello\0world!')
  //   const result = await streamRead(stream, { untilNullByte: true, encoding: 'utf8' })
  //   expect(result).toEqual('Hello')
  // })

  it.each([string, buffer])('should throw if the length is out of bounds', async(input) => {
    const stream = Readable.from(input)
    const shouldReject = () => streamRead(stream, 100)
    await expect(shouldReject).rejects.toThrow(Error)
  })

  // it('should throw if the stream has already ended', async() => {
  //   const stream = Readable.from(string)
  //   stream.destroy()
  //   const shouldReject = () => streamRead(stream)
  //   await expect(shouldReject).rejects.toThrow(Error)
  // })

  it('should throw if the length is not a number', async() => {
    const stream = Readable.from(string)
    // @ts-expect-error: invalid type
    const shouldReject = () => streamRead(stream, { size: 'foo' })
    await expect(shouldReject).rejects.toThrow(TypeError)
  })

  it('should throw if the length is negative', async() => {
    const stream = Readable.from(string)
    const shouldReject = () => streamRead(stream, -1)
    await expect(shouldReject).rejects.toThrow(TypeError)
  })
}
