/* eslint-disable sonarjs/no-duplicate-string */
import { Readable } from 'node:stream'
import { streamRead } from './streamRead'

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
   * @example 1024
   */
  length?: number
}

/**
 * Peeks a stream into a buffer without consuming it.
 *
 * @param stream The stream to peek.
 * @returns A promise that resolves with the buffer.
 * @example streamPeek(fs.createReadStream('file.txt')) // Promise<Buffer>
 */
export function streamPeek(stream: Readable): Promise<Buffer>
/**
 * Peeks a stream into an encoded string without consuming it.
 *
 * @param stream The stream to peek.
 * @param encoding The encoding to use. If not specified, a `Buffer` is returned.
 * @returns A promise that resolves with the encoded string.
 * @example streamPeek(fs.createReadStream('file.txt'), 'utf8') // Promise<string>
 */
export function streamPeek(stream: Readable, encoding: BufferEncoding): Promise<string>
/**
 * Peeks a stream into an encoded string without consuming it.
 *
 * @param stream The stream to peek.
 * @param length The length of the buffer to return. If not specified, the entire stream is buffered.
 * @returns A promise that resolves with the buffer.
 * @example streamPeek(fs.createReadStream('file.txt'), 1024) // Promise<Buffer>
 */
export function streamPeek(stream: Readable, length: number): Promise<Buffer>
/**
 * Peeks a stream into a buffer without consuming it.
 *
 * @param stream The stream to peek.
 * @param options The options to use.
 * @returns A promise that resolves with the buffer.
 * @example streamPeek(fs.createReadStream('file.txt'), { length: 1024 }) // Promise<Buffer>
 */
export async function streamPeek(stream: Readable, options: ToBufferOptions<undefined>): Promise<Buffer>
/**
 * Peeks a stream into an encoded string without consuming it.
 *
 * @param stream The stream to peek.
 * @param options The options to use.
 * @returns A promise that resolves with the encoded string.
 * @example streamPeek(fs.createReadStream('file.txt'), { encoding: 'utf8' }) // Promise<string>
 */
export async function streamPeek(stream: Readable, options: ToBufferOptions<BufferEncoding>): Promise<string>
/**
 * Peeks a stream into a buffer without consuming it.
 *
 * @param stream The stream to peek.
 * @param options The options to use.
 * @returns A promise that resolves with the buffer.
 * @example streamPeek(fs.createReadStream('file.txt'), { length: 1024 }) // Promise<Buffer>
 */
export async function streamPeek(stream: Readable, options?: BufferEncoding | ToBufferOptions | number): Promise<Buffer | string>
export async function streamPeek(stream: Readable, options?: BufferEncoding | ToBufferOptions | number): Promise<Buffer | string> {
  // --- Decompose the parameters and options.
  if (typeof options === 'string') options = { encoding: options }
  if (typeof options === 'number') options = { length: options }
  const { encoding, length } = options ?? {}

  // --- Read the stream.
  const buffer = await streamRead(stream, length)

  // --- Push the writeback into the stream.
  // --- If the stream is already ended, assign a new stream from the writeback.
  stream.readableEnded
    ? Object.assign(stream, Readable.from(buffer))
    : stream.unshift(buffer)

  // --- Return the read bytes.
  return encoding ? buffer.toString(encoding) : buffer
}

/* c8 ignore next */
if (import.meta.vitest) {
  const string = 'Hello, world!'
  const buffer = Buffer.from(string)

  it.each([string, buffer])('should peek the whole stream from %o', async(input) => {
    const stream = Readable.from(input)
    const result = await streamPeek(stream)
    expect(result).toEqual(buffer)
    expect(stream.readableEnded).toEqual(false)
  })

  it.each([string, buffer])('should peek the whole stream as a string from %o', async(input) => {
    const stream = Readable.from(input)
    const result = await streamPeek(stream, 'utf8')
    expect(result).toEqual(string)
  })

  it.each([string, buffer])('should peek a part of the stream from %o', async(input) => {
    const stream = Readable.from(input)
    const result = await streamPeek(stream, 4)
    const expected = buffer.subarray(0, 4)
    expect(result).toEqual(expected)
  })

  it.each([string, buffer])('should peek a part of the stream as a string from %o', async(input) => {
    const stream = Readable.from(input)
    const result = await streamPeek(stream, { length: 4, encoding: 'utf8' })
    const expected = string.slice(0, 4)
    expect(result).toEqual(expected)
  })

  it.each([string, buffer])('should not consume the length of the stream from %o', async(input) => {
    const stream = Readable.from(input)
    const result1 = await streamPeek(stream, 4)
    const result2 = await streamPeek(stream, 4)
    const expected = buffer.subarray(0, 4)
    expect(result1).toEqual(expected)
    expect(result2).toEqual(expected)
  })

  it.each([string, buffer])('should not end the stream from %o', async(input) => {
    const stream = Readable.from(input)
    const result1 = await streamPeek(stream)
    const result2 = await streamPeek(stream)
    expect(result1).toEqual(buffer)
    expect(result2).toEqual(buffer)
  })

  it.each([string, buffer])('should throw if stream is already ended', async() => {
    const stream = Readable.from('Hello, world!')
    stream.destroy()
    const shouldReject = () => streamPeek(stream, 4)
    expect(shouldReject).rejects.toThrow(Error)
  })

  it.each([string, buffer])('should throw if stream is not a stream', async() => {
    // @ts-expect-error: invalid argument type.
    const shouldReject = () => streamPeek(1, 4)
    expect(shouldReject).rejects.toThrow(TypeError)
  })

  it.each([string, buffer])('should throw if length is not a number', async() => {
    const stream = new Readable()
    // @ts-expect-error: invalid argument type.
    const shouldReject = () => streamPeek(stream, true)
    expect(shouldReject).rejects.toThrow(TypeError)
  })

  it.each([string, buffer])('should throw if length is negative', async() => {
    const stream = new Readable()
    const shouldReject = () => streamPeek(stream, -4)
    expect(shouldReject).rejects.toThrow(RangeError)
  })
}
