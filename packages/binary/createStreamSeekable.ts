import type { Readable, TransformCallback, TransformOptions } from 'node:stream'
import { createResolvable } from '@unshared/functions/createResolvable'
import { PassThrough } from 'node:stream'

/**
 * In Node, when you start listening to a `data` event, it automatically
 * starts the flow of data from the source to the destination. This means
 * that the `read` method is called automatically when the stream is readable.
 *
 * This is an issue when we want to read data from the stream without consuming
 * it. To solve this, we need override the `_write` method and we manually
 * emit the `Symbol('EventWrite')` event when data is written to the stream.
 */
const EventWrite = Symbol('EventWrite')

/**
 * Stream that buffers previously consumed data and allows it to be seeked, peeked, and rewound.
 * This stream is useful for reading data from a stream that may be consumed multiple times.
 *
 * @example
 * const buffered = new Seekable()
 * const stream = fs.createReadStream('file.txt')
 * stream.pipe(buffered)
 *
 * // Read the first 10 bytes of the stream.
 * const first = await buffered.readBytes(10)
 *
 * // Peek the next 10 bytes of the stream.
 * const second = await buffered.peek(10)
 *
 * // Seek to the 5th byte of the stream.
 * await buffered.seek(5)
 *
 * // Rewind the stream back to the beginning.
 * buffered.rewind()
 */
export class Seekable extends PassThrough {

  /** The buffer of data that has been written to the stream. */
  public buffer = new Map<number, Buffer>()

  /** The current position in the buffered data. */
  public offsetRead = 0

  /** The total size of the data passed through the stream. */
  public offsetWrite = 0

  /**
   * Extended `_write` method that stores the incoming chunks in the `buffer` map.
   *
   * @param chunk The chunk of data to write to the stream.
   * @param encoding The encoding of the chunk.
   * @param callback The callback to invoke when the write operation is complete.
   * @returns The result of the `_write` method.
   */
  override _write(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) {
    const result = super._write(chunk, encoding, callback)
    this.buffer.set(this.offsetWrite, chunk)
    this.offsetWrite += chunk.length
    this.emit(EventWrite, chunk, encoding)
    return result
  }

  // @ts-expect-error: The `end` method is overloaded in the `PassThrough` class.
  end(callback?: () => void): this
  end(chunk: any, callback?: () => void): this
  end(chunk: any, encoding?: BufferEncoding, callback?: () => void): this
  end(...args: Parameters<PassThrough['end']>) {
    super.end(...args)
    this.emit('end')
  }

  /**
   * Fork this stream from current position to the given size. If
   * no size is given, the fork will contain all the data from the
   * current position to the end of the stream.
   *
   * @param size The number of bytes to fork from the stream.
   * @returns A new `Readable` stream with the forked data.
   * @example
   * const seekable = new Seekable()
   * seekable.write('Hello, world!')
   * const forked = seekable.fork(5)
   *
   * // Read the first 5 bytes from the forked stream.
   * const result = await forked.toArray() // => [ <Buffer 48 65 6c 6c 6f> ]
   */
  fork(size: number = Number.MAX_SAFE_INTEGER): Readable {
    const forked = new PassThrough()

    const onChunk = (chunk: Buffer | string, encoding: BufferEncoding) => {
      if (size >= chunk.length) {
        forked.write(chunk, encoding)
        size -= chunk.length
        return
      }

      // --- If the size was reached, remove the listener and end the stream.
      forked.removeListener(EventWrite, onChunk)
      chunk = typeof chunk === 'string' ? chunk.slice(0, size) : chunk.subarray(0, size)
      forked.write(chunk, encoding)
      forked.end()
      size = 0
    }

    // --- Listen for buffered data and write it to the forked stream.
    this.addListener(EventWrite, onChunk)
    this.prependOnceListener('end', () => {
      forked.removeListener(EventWrite, onChunk)
      forked.end()
    })

    // --- Return the forked stream.
    return forked
  }

  /**
   * Peek the specified number of bytes from the stream without consuming the data.
   *
   * @param size The number of bytes to peek from the stream.
   * @returns A promise that resolves with the data peeked from the stream.
   */
  async peek(size: number): Promise<Buffer> {
    const originalOffset = this.offsetRead
    const result = await this.readBytes(size)
    this.offsetRead = originalOffset
    return result
  }

  /**
   * Reads the specified number of bytes from the internal buffer from the
   * current read offset. If the size is not specified, the entire buffer
   * is read from the current offset.
   *
   * @param size The number of bytes to read from the buffer.
   * @returns The data read from the buffer.
   * @example
   * const seekable = new Seekable()
   * seekable.write('Hello, world!')
   *
   * // Read the first 5 bytes from the internal buffer.
   * const result = seekable.read(5).toString() // => 'Hello'
   */
  override read(size: number = this.offsetReadable): Buffer | undefined {
    if (size === 0) return
    if (this.offsetRead >= this.offsetWrite) return

    // --- Read the data from the buffer.
    const chunk = this.readFromBuffer(this.offsetRead, this.offsetRead + size)
    this.offsetRead += chunk.length
    return chunk
  }

  /**
   * Await the stream to become readable and read the specified number of bytes.
   *
   * @param size The number of bytes to read from the stream.
   * @returns A promise that resolves with the data read from the stream.
   * @example
   * const seekable = new Seekable()
   * seekable.write('Hello, world!')
   *
   * // Read the first 5 bytes from the stream.
   * const result = await seekable.readBytes(5) // => <Buffer 48 65 6c 6c 6f>
   */
  async readBytes(size: number = this.offsetReadable): Promise<Buffer> {
    const offsetTarget = this.offsetRead + size

    // --- Wait for the stream to become readable and queue the read operation.
    while (!this.writableEnded && this.offsetWrite < offsetTarget) {

      // --- Create a resolvable to wait for the stream to become readable.
      const resolvable = createResolvable<void>()
      this.prependOnceListener('end', resolvable.resolve)
      this.prependOnceListener('error', resolvable.reject)
      this.prependOnceListener('data', resolvable.resolve)
      setTimeout(resolvable.resolve)
      await resolvable.promise

      // --- Remove the event listeners to prevent memory leaks.
      this.removeListener('data', resolvable.resolve)
      this.removeListener('end', resolvable.resolve)
      this.removeListener('error', resolvable.reject)

      // --- Trigger the read operation if the stream is readable.
      if (this.readable) super._read(0)
    }

    // --- Read the data from the internal buffer.
    return this.read(size) ?? Buffer.alloc(0)
  }

  async readFloat32(): Promise<number> {
    return this.readBytes(4).then(b => b?.readFloatLE(0))
  }

  async readFloat64(): Promise<number> {
    return this.readBytes(8).then(b => b?.readDoubleLE(0))
  }

  /**
   * Reads the data from the buffer at the current offset without consuming
   * the data from the stream. This method is used internally by the `read`
   * override to read the data from the buffer if it is available.
   *
   * @param start The start offset of the data to read.
   * @param end The end offset of the data to read.
   * @returns The data read from the buffer.
   * @example
   * const seekable = new Seekable()
   * seekable.write('Hello, world!')
   *
   * // Read the first 5 bytes from the internal buffer.
   * const result = seekable.readFromBuffer(7, 12).toString() // => 'world'
   */
  public readFromBuffer(start: number, end: number) {
    const size = end - start

    // --- Collect the chunks containing data within the specified range.
    let chunksStart = -1
    const chunks: Buffer[] = []
    for (const [chunkStart, chunk] of this.buffer) {
      const chunkEnd = chunkStart + chunk.length
      if (chunkStart > end) break
      if (chunkEnd < start) continue
      if (chunksStart === -1) chunksStart = chunkStart
      chunks.push(chunk)
    }

    // --- Concatenate the chunks into a single buffer and slice the result.
    const sliceStart = start - chunksStart
    const sliceEnd = sliceStart + size
    return Buffer.concat(chunks).subarray(sliceStart, sliceEnd)
  }

  async readInt8(): Promise<number> {
    return this.readBytes(1).then(b => b?.readInt8(0))
  }

  async readInt16BE(): Promise<number> {
    return this.readIntBE(2)
  }

  async readInt16LE(): Promise<number> {
    return this.readUintLE(2)
  }

  async readInt32BE(): Promise<number> {
    return this.readIntBE(4)
  }

  async readInt32LE(): Promise<number> {
    return this.readIntLE(4)
  }

  async readIntBE(size: number): Promise<number> {
    return this.readBytes(size).then(b => b?.readIntBE(0, size))
  }

  async readIntLE(size: number): Promise<number> {
    return this.readBytes(size).then(b => b?.readIntLE(0, size))
  }

  async readString(size?: number, encoding: BufferEncoding = 'utf8'): Promise<string> {
    const currentOffset = this.offsetRead

    if (size !== undefined) {
      const bytes = await this.readBytes(size)
      const offsetNull = bytes.indexOf(0)
      const result = (offsetNull !== -1 && offsetNull < size)
        ? bytes.subarray(0, offsetNull).toString(encoding)
        : bytes.subarray(0, size).toString(encoding)

      this.offsetRead = currentOffset + result.length + (offsetNull === -1 ? 0 : 1)
      return result
    }

    const chunks: Buffer[] = []

    // --- Read the data from the stream until a NULL byte is found.
    while (this.offsetRead < this.offsetWrite) {
      const chunk = await this.readBytes()
      if (chunk.length === 0) break
      const offsetNull = chunk.indexOf(0)
      chunks.push(chunk)
      if (offsetNull !== -1) break
    }

    // --- Concatenate the chunks and slice the result.
    const buffer = Buffer.concat(chunks)
    const offsetNull = buffer.indexOf(0)
    const result = offsetNull === -1
      ? buffer.toString(encoding)
      : buffer.subarray(0, offsetNull).toString(encoding)

    // --- Reset the read offset after the null byte and return the result.
    this.offsetRead = currentOffset + result.length + (offsetNull === -1 ? 0 : 1)
    return result
  }

  async readUint8(): Promise<number> {
    return this.readBytes(1).then(b => b?.readUInt8(0))
  }

  async readUint16BE(): Promise<number> {
    return this.readUintBE(2)
  }

  async readUint16LE(): Promise<number> {
    return this.readUintLE(2)
  }

  async readUint32BE(): Promise<number> {
    return this.readUintBE(4)
  }

  async readUint32LE(): Promise<number> {
    return this.readUintLE(4)
  }

  async readUintBE(size: number): Promise<number> {
    return this.readBytes(size).then(b => b?.readUIntBE(0, size))
  }

  async readUintLE(size: number): Promise<number> {
    return this.readBytes(size).then(b => b?.readUIntLE(0, size))
  }

  /**
   * Rewind the stream back to the beginning.
   *
   * @example
   * const seekable = new Seekable()
   * seekable.write('Hello, world!')
   *
   * // Read the first 5 bytes from the stream.
   * const result1 = seekable.read(5) // => <Buffer 48 65 6c 6c 6f>
   *
   * // Rewind the stream back to the beginning and read again.
   * seekable.rewind()
   * const result2 = seekable.read(5) // => <Buffer 48 65 6c 6c 6f>
   */
  public rewind(): void {
    this.offsetRead = 0
  }

  /**
   * Update the read offset to the specified position in the stream.
   *
   * @param offset The position to seek to in the stream.
   * @example
   * const seekable = new Seekable()
   * seekable.write('Hello, world!')
   *
   * // Seek to the 5th byte in the stream.
   * seekable.seek(5)
   *
   * // Read the next 5 bytes from the stream.
   * const result = seekable.read(5) // => <Buffer 2c 20 77 6f 72>
   */
  public seek(offset: number): void {
    this.offsetRead = offset
  }

  /**
   * Skip the specified number of bytes from the stream.
   *
   * @param size The number of bytes to skip from the stream.
   * @example
   * const seekable = new Seekable()
   * seekable.write('Hello, world!')
   *
   * // Skip the first 5 bytes in the stream.
   * seekable.skip(5)
   *
   * // Read the next 5 bytes from the stream.
   * const result = seekable.read(5) // => <Buffer 20 77 6f 72 6c>
   */
  public skip(size: number): void {
    this.offsetRead += size
  }

  /** @returns The amount of bytes available from the buffer ahead of the current position */
  get offsetReadable() {
    return this.offsetWrite - this.offsetRead
  }
}

/**
 * Create a stream that buffers previously consumed data and allows it to be seeked, peeked, and rewound.
 * This stream is useful for reading data from a stream that may be consumed multiple times.
 *
 * @param options The options to use for the stream.
 * @returns The seekable stream.
 * @example
 * const buffered = createStreamSeekable()
 * const stream = createReadStream('file.txt')
 * stream.pipe(buffered)
 *
 * // Read the first 10 bytes of the stream.
 * const first = await buffered.readBytes(10)
 *
 * // Peek the next 10 bytes of the stream.
 * const second = await buffered.peek(10)
 *
 * // Seek to the 5th byte of the stream.
 * await buffered.seek(5)
 *
 * // Rewind the stream back to the beginning.
 * buffered.rewind()
 */
export function createStreamSeekable(options?: TransformOptions) {
  return new Seekable(options)
}
