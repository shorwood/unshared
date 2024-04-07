import { PassThrough, TransformCallback } from "node:stream"
import { nextTick } from "node:process"

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

  /** The intrinsic position of the stream. */
  public offsetIntrinsic = 0

  /** The current position in the buffered data. */
  public offsetRead = 0

  /** The total size of the data passed through the stream. */
  public offsetWrite = 0

  /** The buffer of data that has been written to the stream. */
  public buffer = new Map<number, Buffer>()

  /** The total count of bytes that have been stored in the buffer. */
  public bufferLength = 0

  /** Extended `_write` method that stores the incoming chunks in the `buffer` map. */
  override _write(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) {
    const result = super._write(chunk, encoding, callback)
    this.buffer.set(this.offsetWrite, chunk)
    this.bufferLength += chunk.length
    this.offsetWrite += chunk.length
    return result
  }

  /**
   * Reads the data from the buffer at the current offset without consuming 
   * the data from the stream. This method is used internally by the `read`
   * override to read the data from the buffer if it is available.
   * 
   * @param size The size of the data to read.
   * @returns The data read from the buffer.
   * @example
   * const seekable = new Seekable()
   * seekable.write('Hello, world!')
   * 
   * // Read the first 5 bytes from the internal buffer.
   * const result = seekable.readFromBuffer(7, 12).toString() // => 'world'
   */
  public readFromBuffer(start: number, end: number) {

    // --- Collect the chunks containing data within the specified range.
    let startOffset = -1
    const chunks: Buffer[] = []
    for (const [offsetStart, chunk] of this.buffer) {
      const offsetEnd = offsetStart + chunk.length
      if (offsetStart > end) break
      if (offsetEnd <= start) continue
      if (startOffset < 0) startOffset = offsetStart
      chunks.push(chunk)
    }

    // --- Concatenate the chunks into a single buffer and slice the result.
    const sliceStart = start - startOffset
    const sliceEnd = end - startOffset
    return Buffer.concat(chunks).subarray(sliceStart, sliceEnd)
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
  override read(size: number = this.readableLength) {
    if (size === 0) return null
    if (this.offsetRead >= this.offsetWrite) return null

    // --- Read the data from the buffer.
    const chunk = this.readFromBuffer(this.offsetRead, this.offsetRead + size)

    // --- If the bytes are read from
    const readSize = this.offsetWrite - this.offsetRead + chunk.length
    if (readSize > 0) void super.read(readSize)
    this.offsetRead += chunk.length

    // --- Return the chunk of data.
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
  async readBytes(size?: number): Promise<Buffer | undefined> {
    await new Promise(nextTick)

    // --- Wait for the stream to become readable.
    if (this.readableLength === 0 && !this.writableEnded) {
      await new Promise<void>((resolve, reject) => {
        this.once('end', reject)
        this.once('error', reject)
        this.once('readable', resolve)
        setTimeout(() => reject(new Error('Timeout exceeded')), 100)
      })
    }

    // --- Read the data from the internal buffer.
    return this.read(size) ?? undefined
  }

  /**
   * Peek the specified number of bytes from the stream without consuming the data.
   * 
   * @param size The number of bytes to peek from the stream.
   * @returns A promise that resolves with the data peeked from the stream.
   */
  async peek(size: number): Promise<Buffer | undefined> {
    const originalOffset = this.offsetRead
    const result = await this.readBytes(size)
    this.offsetRead = originalOffset
    return result
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

  async readString(encoding: BufferEncoding = 'utf8'): Promise<string> {
    const chunks: Buffer[] = []

    // --- Read the data from the stream until a NULL byte is found.
    while (true) {
      const chunk = await this.readBytes()
      if (!chunk) break
      const nullIndex = chunk.indexOf(0)
      chunks.push(chunk)
      if (nullIndex > 0) break
    }

    // --- Concatenate the chunks and slice the result.
    const buffer = Buffer.concat(chunks)
    const nullIndex = buffer.indexOf(0)
    const result = nullIndex > 0 
      ? buffer.subarray(0, nullIndex).toString(encoding)
      : buffer.toString(encoding)

    // --- Set the read offset after the null byte and return the result.
    this.offsetRead += result.length + 1
    return result
  }

  async readUint8(): Promise<number | undefined> {
    return this.readBytes(1).then(b => b?.readUInt8(0))
  }

  async readInt8(): Promise<number | undefined> {
    return this.readBytes(1).then(b => b?.readInt8(0))
  }

  async readIntLE(size: number): Promise<number | undefined> {
    return this.readBytes(size).then(b => b?.readIntLE(0, size))
  }

  async readIntBE(size: number): Promise<number | undefined> {
    return this.readBytes(size).then(b => b?.readIntBE(0, size))
  }

  async readUintLE(size: number): Promise<number | undefined> {
    return this.readBytes(size).then(b => b?.readUIntLE(0, size))
  }

  async readUintBE(size: number): Promise<number | undefined> {
    return this.readBytes(size).then(b => b?.readUIntBE(0, size))
  }

  async readInt16LE(): Promise<number | undefined> {
    return this.readUintLE(2)
  }

  async readInt16BE(): Promise<number | undefined> {
    return this.readIntBE(2)
  }

  async readUint16LE(): Promise<number | undefined> {
    return this.readUintLE(2)
  }

  async readUint16BE(): Promise<number | undefined> {
    return this.readUintBE(2)
  }
  
  async readInt32LE(): Promise<number | undefined> {
    return this.readIntLE(4)
  }

  async readInt32BE(): Promise<number | undefined> {
    return this.readIntBE(4)
  }

  async readUint32LE(): Promise<number | undefined> {
    return this.readUintLE(4)
  }

  async readUint32BE(): Promise<number | undefined> {
    return this.readUintBE(4)
  }
  
  async readFloat32(): Promise<number | undefined> {
    return this.readBytes(4).then(b => b?.readFloatLE(0))
  }

  async readFloat64(): Promise<number | undefined> {
    return this.readBytes(8).then(b => b?.readDoubleLE(0))
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { Readable } = await import('node:stream')

  describe('_write', () => {
    it('should store the written chunk in the buffer when calling write', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      const expected = new Map([[0, Buffer.from('ABCD')]])
      expect(stream.buffer).toStrictEqual(expected)
    })

    it('should store the written chunks in the buffer when calling write multiple times', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const expected = new Map([
        [0, Buffer.from('ABCD')],
        [4, Buffer.from('EFGH')]
      ])
      expect(stream.buffer).toStrictEqual(expected)
    })

    it('should store the written chunks when piping a stream', async() => {
      const stream = new Seekable()
      const source = Readable.from(['ABCD', 'EFGH'])
      source.pipe(stream)
      await new Promise(nextTick)
      const expected = new Map([
        [0, Buffer.from('ABCD')],
        [4, Buffer.from('EFGH')]
      ])
      expect(stream.buffer).toStrictEqual(expected)
    })

    it('should update the write offset when writing chunks', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      expect(stream.offsetWrite).toEqual(8)
    })

    it('should not update the read offset when writing chunks', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      expect(stream.offsetRead).toEqual(0)
    })
  })

  describe('readFromBuffer', () => {
    it('should read the entire chunk', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      const result = stream.readFromBuffer(0, 4).toString()
      expect(result).toEqual('ABCD')
    })

    it('should read the start of the chunk', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      const result = stream.readFromBuffer(0, 2).toString()
      expect(result).toEqual('AB')
    })

    it('should read the middle of the chunk', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      const result = stream.readFromBuffer(1, 3).toString()
      expect(result).toEqual('BC')
    })

    it('should read the end of the chunk', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      const result = stream.readFromBuffer(2, 4).toString()
      expect(result).toEqual('CD')
    })

    it('should read the entire chunks', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(0, 8).toString()
      expect(result).toEqual('ABCDEFGH')
    })

    it('should read the start of the second chunk', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(4, 6).toString()
      expect(result).toEqual('EF')
    })

    it('should read the middle of the second chunk', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(5, 7).toString()
      expect(result).toEqual('FG')
    })

    it('should read the end of the second chunk', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(6, 8).toString()
      expect(result).toEqual('GH')
    })

    it('should read the end of the first chunk and the start of the second chunk', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.readFromBuffer(3, 5).toString()
      expect(result).toEqual('DE')
    })

    it('should not update the read offset when reading from the buffer', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      stream.readFromBuffer(0, 4)
      expect(stream.offsetRead).toEqual(0)
    })
  })

  describe('read', () => {
    it('should read one chunk from the stream', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      const result = stream.read(2)!.toString()
      expect(result).toEqual('AB')
    })

    it('should return null if the stream is empty', () => {
      const stream = new Seekable()
      const result = stream.read()
      expect(result).toBeNull()
    })

    it('should return null if the stream has ended', () => {
      const stream = new Seekable()
      stream.end()
      const result = stream.read()
      expect(result).toBeNull()
    })

    it('should return null if the stream has been destroyed', () => {
      const stream = new Seekable()
      stream.destroy()
      const result = stream.read()
      expect(result).toBeNull()
    })

    it('should return null if reading past the end of the stream', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.read(4)
      const result = stream.read()
      expect(result).toBeNull()
    })

    it('should consecutively read the data from the stream', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result1 = stream.read(2)!.toString()
      const result2 = stream.read(2)!.toString()
      const result3 = stream.read(2)!.toString()
      const result4 = stream.read(2)!.toString()
      expect(result1).toEqual('AB')
      expect(result2).toEqual('CD')
      expect(result3).toEqual('EF')
      expect(result4).toEqual('GH')
    })

    it('should read the entire stream in one go', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.write('EFGH')
      const result = stream.read(8)!.toString()
      expect(result).toEqual('ABCDEFGH')
    })

    it('should update the read offset when reading chunks', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.read(2)
      expect(stream.offsetRead).toEqual(2)
    })

    it('should not update the write offset when reading chunks', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.read(2)
      expect(stream.offsetWrite).toEqual(4)
    })
  })

  describe('readBytes', () => {
    it('should read the specified number of bytes from the stream', async () => {
      const stream = new Seekable()
      stream.write('ABCD')
      const result = await stream.readBytes(2)
      expect(result!.toString()).toEqual('AB')
    })

    it('should wait for the stream to become readable', async () => {
      const stream = new Seekable()
      const result = stream.readBytes(2)
      stream.write('ABCD')
      const buffer = await result
      expect(buffer!.toString()).toEqual('AB')
    })

    it('should return an empty buffer if the stream has ended', async () => {
      const stream = new Seekable()
      stream.end()
      const result = await stream.readBytes(2)
      expect(result).toBeUndefined()
    })
  })

  describe('seek', () => {
    it('should update the read offset to the specified position', async () => {
      const stream = new Seekable()
      stream.seek(2)
      expect(stream.offsetRead).toEqual(2)
    })

    it('should read the data from the specified position', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.seek(2)
      const result = stream.read(2)!.toString()
      expect(result).toEqual('CD')
    })
  })

  describe('peek', () => {
    it('should read the specified number of bytes from the stream without consuming the data', async () => {
      const stream = new Seekable()
      stream.write('ABCD')
      const result = await stream.peek(2)
      expect(result!.toString()).toEqual('AB')
    })

    it('should not update the read offset when peeking data', async () => {
      const stream = new Seekable()
      stream.write('ABCD')
      await stream.peek(2)
      expect(stream.offsetRead).toEqual(0)
    })
  })

  describe('rewind', () => {
    it('should reset the read offset back to the beginning of the stream', async () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.read(2)
      stream.rewind()
      expect(stream.offsetRead).toEqual(0)
    })

    it('should read back the data from the beginning of the stream', () => {
      const stream = new Seekable()
      stream.write('ABCD')
      stream.read(2)
      stream.rewind()
      const result = stream.read(2)!.toString()
      expect(result).toEqual('AB')
    })
  })

  describe('readString', () => {
    it('should read until a null byte is found', async () => {
      const stream = new Seekable()
      stream.write('Hello,\0world!')
      const result = await stream.readString()
      expect(result).toEqual('Hello,')
    })

    it('should read until the end of the stream', async () => {
      const stream = new Seekable()
      stream.write('Hello, world!')
      const result = await stream.readString()
      expect(result).toEqual('Hello, world!')
    })

    it('should read a string with a specified encoding', async () => {
      const stream = new Seekable()
      stream.write('Hello, World!')
      const result = await stream.readString('hex')
      expect(result).toEqual('48656c6c6f2c20576f726c6421')
    })

    // it('should read the specified number of bytes', async () => {
    //   const stream = new Seekable()
    //   stream.write('Hello, world!')
    //   const result = await stream.readString(5)
    //   expect(result).toEqual('Hello')
    // })
  })

  describe('readIntegers', () => {
    it('should read an N-bit little-endian signed integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readIntLE(4)
      expect(result).toEqual(-1)
    })

    it('should read an N-bit big-endian signed integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readIntBE(4)
      expect(result).toEqual(-1)
    })

    it('should read an N-bit unsigned integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUintLE(4)
      expect(result).toEqual(0xFFFFFFFF)
    })

    it('should read an unsigned 8-bit integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint8()
      expect(result).toEqual(0xFF)
    })

    it('should read a signed 8-bit integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt8()
      expect(result).toEqual(-0x01)
    })

    it('should read a little-endian 16-bit unsigned integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint16LE()
      expect(result).toEqual(0xFFFF)
    })

    it('should read a little-endian 16-bit signed integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt16LE()
      expect(result).toEqual(0xFFFF)
    })

    it('should read a big-endian 16-bit unsigned integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint16BE()
      expect(result).toEqual(0xFFFF)
    })

    it('should read a big-endian 16-bit signed integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt16BE()
      expect(result).toEqual(-1)
    })

    it('should read a little-endian 32-bit unsigned integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint32LE()
      expect(result).toEqual(0xFFFFFFFF)
    })

    it('should read a little-endian 32-bit signed integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt32LE()
      expect(result).toEqual(-1)
    })

    it('should read a big-endian 32-bit unsigned integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readUint32BE()
      expect(result).toEqual(0xFFFFFFFF)
    })

    it('should read a big-endian 32-bit signed integer', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]))
      const result = await stream.readInt32BE()
      expect(result).toEqual(-1)
    })

    it('should read a little-endian 32-bit float', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0x00, 0x00, 0x80, 0x3F]))
      const result = await stream.readFloat32()
      expect(result).toEqual(1)
    })

    it('should read a little-endian 64-bit float', async () => {
      const stream = new Seekable()
      stream.write(Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF0, 0x3F]))
      const result = await stream.readFloat64()
      expect(result).toEqual(1)
    })
  })
}
