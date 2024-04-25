import { PassThrough, Readable, TransformCallback, TransformOptions } from 'node:stream'
import { nextTick } from 'node:process'
import { createResolvable } from '@unshared/functions'

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
      chunk = chunk.slice(0, size)
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

/* v8 ignore start */
if (import.meta.vitest) {

  describe('_write', () => {
    it('should store the written chunk in the buffer when calling write', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      const expected = new Map([[0, Buffer.from('ABCD')]])
      expect(stream.buffer).toStrictEqual(expected)
    })

    it('should store the written chunks in the buffer when calling write multiple times', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const expected = new Map([
        [0, Buffer.from('ABCD')],
        [4, Buffer.from('EFGH')],
      ])
      expect(stream.buffer).toStrictEqual(expected)
    })

    it('should store the written chunks when piping a stream', async() => {
      const { Readable } = await import('node:stream')
      const stream = createStreamSeekable()
      const source = Readable.from(['ABCD', 'EFGH'])
      source.pipe(stream)
      await new Promise(nextTick)
      const expected = new Map([
        [0, Buffer.from('ABCD')],
        [4, Buffer.from('EFGH')],
      ])
      expect(stream.buffer).toStrictEqual(expected)
    })

    it('should update the write offset when writing chunks', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      expect(stream.offsetWrite).toBe(8)
    })

    it('should not update the read offset when writing chunks', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      expect(stream.offsetRead).toBe(0)
    })
  })

  describe('readFromBuffer', () => {
    it('should read the entire chunk', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      const result = stream.readFromBuffer(0, 4).toString()
      expect(result).toBe('ABCD')
    })

    it('should read the start of the chunk', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      const result = stream.readFromBuffer(0, 2).toString()
      expect(result).toBe('AB')
    })

    it('should read the middle of the chunk', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      const result = stream.readFromBuffer(1, 3).toString()
      expect(result).toBe('BC')
    })

    it('should read the end of the chunk', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      const result = stream.readFromBuffer(2, 4).toString()
      expect(result).toBe('CD')
    })

    it('should read the entire chunks', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(0, 8).toString()
      expect(result).toBe('ABCDEFGH')
    })

    it('should read the start of the second chunk', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(4, 6).toString()
      expect(result).toBe('EF')
    })

    it('should read the middle of the second chunk', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(5, 7).toString()
      expect(result).toBe('FG')
    })

    it('should read the end of the second chunk', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(6, 8).toString()
      expect(result).toBe('GH')
    })

    it('should read the end of the first chunk and the start of the second chunk', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(3, 5).toString()
      expect(result).toBe('DE')
    })

    it('should not update the read offset when reading from the buffer', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      stream.readFromBuffer(0, 4)
      expect(stream.offsetRead).toBe(0)
    })
  })

  describe('read', () => {
    it('should read one chunk from the stream', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      const result = stream.read(2)!.toString()
      expect(result).toBe('AB')
    })

    it('should return null if the stream is empty', () => {
      const stream = createStreamSeekable()
      const result = stream.read()
      expect(result).toBeUndefined()
    })

    it('should return null if the stream has ended', () => {
      const stream = createStreamSeekable()
      stream.end()
      const result = stream.read()
      expect(result).toBeUndefined()
    })

    it('should return null if the stream has been destroyed', () => {
      const stream = createStreamSeekable()
      stream.destroy()
      const result = stream.read()
      expect(result).toBeUndefined()
    })

    it('should return null if reading past the end of the stream', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.read(4)
      const result = stream.read()
      expect(result).toBeUndefined()
    })

    it('should consecutively read the data from the stream', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result1 = stream.read(2)!.toString()
      const result2 = stream.read(2)!.toString()
      const result3 = stream.read(2)!.toString()
      const result4 = stream.read(2)!.toString()
      expect(result1).toBe('AB')
      expect(result2).toBe('CD')
      expect(result3).toBe('EF')
      expect(result4).toBe('GH')
    })

    it('should read the entire stream in one go', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.read(8)!.toString()
      expect(result).toBe('ABCDEFGH')
    })

    it('should update the read offset when reading chunks', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.read(2)
      expect(stream.offsetRead).toBe(2)
    })

    it('should not update the write offset when reading chunks', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.read(2)
      expect(stream.offsetWrite).toBe(4)
    })

    it('should not skip data when reading chunks', async() => {
      const { randomBytes } = await import('node:crypto')
      const stream = createStreamSeekable({ highWaterMark: 512 })
      const promise = stream.readBytes(2048)
      setTimeout(() => stream.write(randomBytes(512)), 5)
      setTimeout(() => stream.write(randomBytes(512)), 10)
      setTimeout(() => stream.write(randomBytes(512)), 15)
      setTimeout(() => stream.end(randomBytes(512)), 20)
      const buffer = (await promise)
      expect(buffer).toHaveLength(2048)
    })
  })

  describe('readBytes', () => {
    it('should read the specified number of bytes from the stream', async() => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      const result = await stream.readBytes(2)
      expect(result.toString()).toBe('AB')
    })

    it('should read the specified number of bytes from before the read offset', async() => {
      const stream = createStreamSeekable()
      setTimeout(() => stream.write('ABCD'), 10)
      setTimeout(() => stream.write('EFGH'), 20)
      stream.seek(2)
      const result = await stream.readBytes(4)
      expect(result.toString()).toBe('CDEF')
    })

    it('should wait for the stream to become readable', async() => {
      const stream = createStreamSeekable()
      const result = stream.readBytes(2)
      setTimeout(() => stream.write('AB'), 10)
      const buffer = await result
      expect(buffer.toString()).toBe('AB')
    })

    it('should return an empty buffer if the stream has ended', async() => {
      const stream = createStreamSeekable()
      stream.end()
      const result = await stream.readBytes(2)
      expect(result).toHaveLength(0)
    })

    it('should await for the next chunks if the size is not reached yet', async() => {
      const stream = createStreamSeekable({ highWaterMark: 4 })
      setTimeout(() => stream.write('ABCD'), 5)
      setTimeout(() => stream.write('EFGH'), 10)
      setTimeout(() => stream.write('IJKL'), 15)
      setTimeout(() => stream.write('MNOP'), 20)
      setTimeout(() => stream.end(), 30)
      const result = await stream.readBytes(16).then(b => b.toString())
      expect(result).toBe('ABCDEFGHIJKLMNOP')
    })

    it('should return undefined if the stream ends after a period of time', async() => {
      const stream = createStreamSeekable()
      const result = stream.readBytes(1)
      setTimeout(() => stream.end(), 10)
      const buffer = await result
      expect(buffer).toHaveLength(0)
    })

    it('should reject the promise if the stream emits an error', async() => {
      const stream = createStreamSeekable()
      const result = stream.readBytes(1)
      setTimeout(() => stream.emit('error', new Error('Test')), 10)
      await expect(result).rejects.toThrow('Test')
    })
  })

  describe('seek', () => {
    it('should update the read offset to the specified position', () => {
      const stream = createStreamSeekable()
      stream.seek(2)
      expect(stream.offsetRead).toBe(2)
    })

    it('should read the data from the specified position', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.seek(2)
      const result = stream.read(2)!.toString()
      expect(result).toBe('CD')
    })
  })

  describe('peek', () => {
    it('should read the specified number of bytes from the stream without consuming the data', async() => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      const result = await stream.peek(2)
      expect(result.toString()).toBe('AB')
    })

    it('should not update the read offset when peeking data', async() => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      await stream.peek(2)
      expect(stream.offsetRead).toBe(0)
    })
  })

  describe('rewind', () => {
    it('should reset the read offset back to the beginning of the stream', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.read(2)
      stream.rewind()
      expect(stream.offsetRead).toBe(0)
    })

    it('should read back the data from the beginning of the stream', () => {
      const stream = createStreamSeekable()
      stream.write('ABCD')
      stream.read(2)
      stream.rewind()
      const result = stream.read(2)!.toString()
      expect(result).toBe('AB')
    })
  })

  describe('readString', () => {
    it('should read until a null byte is found', async() => {
      const stream = createStreamSeekable()
      stream.write('Hello,\0world!')
      const result = await stream.readString()
      expect(result).toBe('Hello,')
      expect(stream.offsetRead).toBe(7)
    })

    it('should read consecutive strings separated by a null byte', async() => {
      const stream = createStreamSeekable()
      stream.write('Hello,\0world!\0')
      stream.end()
      const result1 = await stream.readString()
      const result2 = await stream.readString()
      expect(result1).toBe('Hello,')
      expect(result2).toBe('world!')
      expect(stream.offsetRead).toBe(14)
    })

    it('should return an empty string if the first byte is a null byte', async() => {
      const stream = createStreamSeekable()
      stream.write('\0Hello, world!')
      const result = await stream.readString()
      expect(result).toBe('')
      expect(stream.offsetRead).toBe(1)
    })

    it('should read until the end of the stream', async() => {
      const stream = createStreamSeekable()
      stream.write('Hello, world!')
      const result = await stream.readString()
      expect(result).toBe('Hello, world!')
      expect(stream.offsetRead).toBe(13)
    })

    it('should read a string with a specified encoding', async() => {
      const stream = createStreamSeekable()
      stream.write('Hello, World!')
      const result = await stream.readString(undefined, 'hex')
      expect(result).toBe('48656c6c6f2c20576f726c6421')
    })

    it('should read the specified number of bytes', async() => {
      const stream = createStreamSeekable()
      stream.write('Hello, world!')
      const result = await stream.readString(5)
      expect(result).toBe('Hello')
      expect(stream.offsetRead).toBe(5)
    })

    it('should read the specified number of bytes until a null byte is found', async() => {
      const stream = createStreamSeekable()
      stream.write('Hello,\0world!')
      const result = await stream.readString(10)
      expect(result).toBe('Hello,')
      expect(stream.offsetRead).toBe(7)
    })
  })

  describe('readIntegers', () => {
    it('should read an N-bit little-endian signed integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readIntLE(4)
      expect(result).toBe(-1)
    })

    it('should read an N-bit big-endian signed integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readIntBE(4)
      expect(result).toBe(-1)
    })

    it('should read an N-bit unsigned integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUintLE(4)
      expect(result).toBe(0xFFFFFFFF)
    })

    it('should read an unsigned 8-bit integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint8()
      expect(result).toBe(0xFF)
    })

    it('should read a signed 8-bit integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt8()
      expect(result).toBe(-0x01)
    })

    it('should read a little-endian 16-bit unsigned integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint16LE()
      expect(result).toBe(0xFFFF)
    })

    it('should read a little-endian 16-bit signed integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt16LE()
      expect(result).toBe(0xFFFF)
    })

    it('should read a big-endian 16-bit unsigned integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint16BE()
      expect(result).toBe(0xFFFF)
    })

    it('should read a big-endian 16-bit signed integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt16BE()
      expect(result).toBe(-1)
    })

    it('should read a little-endian 32-bit unsigned integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint32LE()
      expect(result).toBe(0xFFFFFFFF)
    })

    it('should read a little-endian 32-bit signed integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt32LE()
      expect(result).toBe(-1)
    })

    it('should read a big-endian 32-bit unsigned integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint32BE()
      expect(result).toBe(0xFFFFFFFF)
    })

    it('should read a big-endian 32-bit signed integer', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt32BE()
      expect(result).toBe(-1)
    })

    it('should read a little-endian 32-bit float', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0x00, 0x00, 0x80, 0x3F]))
      const result = await stream.readFloat32()
      expect(result).toBe(1)
    })

    it('should read a little-endian 64-bit float', async() => {
      const stream = createStreamSeekable()
      stream.write(Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF0, 0x3F]))
      const result = await stream.readFloat64()
      expect(result).toBe(1)
    })
  })

  describe('fork', () => {
    it('should create a fork of the stream from the current position', async() => {
      const stream = createStreamSeekable()
      const forked = stream.fork()
      const chunks = forked.toArray()
      stream.write('Hello')
      stream.write(', World!')
      stream.end()
      const result = Buffer.concat(await chunks).toString()
      expect(result).toBe('Hello, World!')
    })

    it('should create a fork of the stream from the current position with a specified size', async() => {
      const stream = createStreamSeekable()
      const forked = stream.fork(5)
      const chunks = forked.toArray()
      stream.write('Hello')
      stream.write(', World!')
      stream.end()
      const result = Buffer.concat(await chunks).toString()
      expect(result).toBe('Hello')
    })
  })
}
