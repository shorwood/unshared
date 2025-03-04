import { encodeBase64 } from './encodeBase64'

describe('encodeBase64', () => {
  describe('input conversion', () => {
    it('should encode an Array into a Base64-encoded string', () => {
      const result = encodeBase64([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64])
      expect(result).toBe('SGVsbG8sIFdvcmxk')
    })

    it('should encode an `BinaryLike` into a Base64-encoded string', () => {
      const buffer = new TextEncoder().encode('Hello, World').buffer
      const result = encodeBase64(buffer)
      expect(result).toBe('SGVsbG8sIFdvcmxk')
    })

    it('should encode a `Buffer` into a Base64-encoded string', () => {
      const buffer = Buffer.from('Hello, World')
      const result = encodeBase64(buffer)
      expect(result).toBe('SGVsbG8sIFdvcmxk')
    })

    it('should encode a `string` into a Base64-encoded string', () => {
      const result = encodeBase64('Hello, World')
      expect(result).toBe('SGVsbG8sIFdvcmxk')
    })
  })

  describe('remainder handling', () => {
    it('should encode a buffer to a Base64-encoded string with a remainder of 0', () => {
      const result = encodeBase64('Hello, World')
      expect(result).toBe('SGVsbG8sIFdvcmxk')
    })

    it('should encode a buffer to a Base64-encoded string with a remainder of 1', () => {
      const result = encodeBase64('Hello, World!?')
      expect(result).toBe('SGVsbG8sIFdvcmxkIT8=')
    })

    it('should encode a buffer to a Base64-encoded string with a remainder of 2', () => {
      const result = encodeBase64('Hello, World!')
      expect(result).toBe('SGVsbG8sIFdvcmxkIQ==')
    })
  })

  describe('edge cases', () => {
    it('should encode a 3-byte buffer to a Base64-encoded string', () => {
      const result = encodeBase64([0x00, 0x0F, 0xBF])
      expect(result).toBe('AA+/')
    })

    it('should encode a single byte to a Base64-encoded string', () => {
      const result = encodeBase64([0x01])
      expect(result).toBe('AQ==')
    })

    it('should encode an empty buffer to an empty string', () => {
      const result = encodeBase64([])
      expect(result).toBe('')
    })
  })
})
