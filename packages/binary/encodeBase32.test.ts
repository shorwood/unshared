import { encodeBase32 } from './encodeBase32'

describe('encodeBase32', () => {
  describe('input conversion', () => {
    it('should encode an Array into a Base32-encoded string', () => {
      const result = encodeBase32([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21])
      expect(result).toBe('JBSWY3DPFQQFO33SNRSCC===')
    })

    it('should encode an `BinaryLike` into a Base32-encoded string', () => {
      const buffer = new TextEncoder().encode('Hello, World!').buffer
      const result = encodeBase32(buffer)
      expect(result).toBe('JBSWY3DPFQQFO33SNRSCC===')
    })

    it('should encode a `Buffer` into a Base32-encoded string', () => {
      const buffer = Buffer.from('Hello, World!')
      const result = encodeBase32(buffer)
      expect(result).toBe('JBSWY3DPFQQFO33SNRSCC===')
    })

    it('should encode a `string` into a Base32-encoded string', () => {
      const result = encodeBase32('Hello, World!')
      expect(result).toBe('JBSWY3DPFQQFO33SNRSCC===')
    })
  })

  describe('remainder handling', () => {
    it('should encode a buffer to a Base32-encoded string with a remainder of 0', () => {
      const result = encodeBase32('Hello, World!?!')
      expect(result).toBe('JBSWY3DPFQQFO33SNRSCCPZB')
    })

    it('should encode a buffer to a Base32-encoded string with a remainder of 1', () => {
      const result = encodeBase32('Hello, World!?')
      expect(result).toBe('JBSWY3DPFQQFO33SNRSCCPY=')
    })

    it('should encode a buffer to a Base32-encoded string with a remainder of 3', () => {
      const result = encodeBase32('Hello, World!')
      expect(result).toBe('JBSWY3DPFQQFO33SNRSCC===')
    })

    it('should encode a buffer to a Base32-encoded string with a remainder of 4', () => {
      const result = encodeBase32('Hello, World')
      expect(result).toBe('JBSWY3DPFQQFO33SNRSA====')
    })
  })

  describe('edge cases', () => {
    it('should encode a single byte to a Base32-encoded string', () => {
      const result = encodeBase32([0x10])
      expect(result).toBe('CA======')
    })

    it('should encode an empty buffer to an empty string', () => {
      const result = encodeBase32([])
      expect(result).toBe('')
    })
  })
})
