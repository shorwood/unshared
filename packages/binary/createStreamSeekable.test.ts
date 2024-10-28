import { createStreamSeekable } from './createStreamSeekable'

describe('createStreamSeekable', () => {
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
      await new Promise(resolve => process.nextTick(resolve))
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
})
