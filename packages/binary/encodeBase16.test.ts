import { encodeBase16 } from './encodeBase16'

describe('encodeBase16', () => {
  describe('input conversion', () => {
    it('should encode an Array into a Base16-encoded string', () => {
      const result = encodeBase16([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64])
      expect(result).toBe('48656c6c6f2c20576f726c64')
    })

    it('should encode an `BinaryLike` into a Base16-encoded string', () => {
      const buffer = new TextEncoder().encode('Hello, World').buffer
      const result = encodeBase16(buffer)
      expect(result).toBe('48656c6c6f2c20576f726c64')
    })

    it('should encode a `Buffer` into a Base16-encoded string', () => {
      const buffer = Buffer.from('Hello, World')
      const result = encodeBase16(buffer)
      expect(result).toBe('48656c6c6f2c20576f726c64')
    })

    it('should encode a `string` into a Base16-encoded string', () => {
      const result = encodeBase16('Hello, World')
      expect(result).toBe('48656c6c6f2c20576f726c64')
    })
  })

  describe('edge cases', () => {
    it('should encode an empty buffer', () => {
      const result = encodeBase16([])
      expect(result).toBe('')
    })

    it('should encode a buffer with a single byte', () => {
      const result = encodeBase16([0x10])
      expect(result).toBe('10')
    })
  })
})
