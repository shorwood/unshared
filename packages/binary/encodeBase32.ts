import { BinaryLike, toUint8Array } from './toUint8Array'

/** The Base32 alphabet table as defined in [RFC 4648](https://tools.ietf.org/html/rfc4648#section-6). */
export const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Encode a `BinaryLike` into a Base32-encoded string. This implementation is
 * agnostic to the environment and can be used in both Node.js and browsers.
 *
 * @param value The value to encode.
 * @returns The Base32-encoded string.
 * @example encodeBase32('Hello, World') // 'JBSWY3DPFQQFO33SNRSA===='
 */
export function encodeBase32(value: BinaryLike): string {
  const view = toUint8Array(value)
  let result = ''

  // --- Loop over every byte in the Buffer in 5-byte chunks.
  for (let i = 0; i < view.byteLength; i += 5) {
    const remaining = view.byteLength - i

    // --- Get 5 bytes from the buffer.
    if (remaining === 0) break
    const byte0 = view[i]
    const byte1 = (remaining > 1) ? view[i + 1] : 0
    const byte2 = (remaining > 2) ? view[i + 2] : 0
    const byte3 = (remaining > 3) ? view[i + 3] : 0
    const byte4 = (remaining > 4) ? view[i + 4] : 0

    // --- Encode the 5 bytes into 8 Base32 characters.
    const c0 = ((byte0 >> 3) & 0b00011111)
    const c1 = ((byte0 << 2) & 0b00011100) | ((byte1 >> 6) & 0b00000011)
    const c2 = ((byte1 >> 1) & 0b00011111)
    const c3 = ((byte1 << 4) & 0b00010000) | ((byte2 >> 4) & 0b00001111)
    const c4 = ((byte2 << 1) & 0b00011110) | ((byte3 >> 7) & 0b00000001)
    const c5 = ((byte3 >> 2) & 0b00011111)
    const c6 = ((byte3 << 3) & 0b00011000) | ((byte4 >> 5) & 0b00000111)
    const c7 = byte4 & 0b00011111

    // --- Append the 8 Base32 characters to the result.
    switch (remaining) {
      case 1: { result += `${B32[c0] + B32[c1]}======`; break }
      case 2: { result += `${B32[c0] + B32[c1] + B32[c2] + B32[c3]}====`; break }
      case 3: { result += `${B32[c0] + B32[c1] + B32[c2] + B32[c3] + B32[c4]}===`; break }
      case 4: { result += `${B32[c0] + B32[c1] + B32[c2] + B32[c3] + B32[c4] + B32[c5] + B32[c6]}=`; break }
      default: { result += B32[c0] + B32[c1] + B32[c2] + B32[c3] + B32[c4] + B32[c5] + B32[c6] + B32[c7] }
    }
  }

  return result
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('input conversion', () => {
    it('should encode an Array into a Base32-encoded string', () => {
      const result = encodeBase32([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21])
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCC===')
    })

    it('should encode an `BinaryLike` into a Base32-encoded string', () => {
      const buffer = new TextEncoder().encode('Hello, World!').buffer
      const result = encodeBase32(buffer)
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCC===')
    })

    it('should encode a `Buffer` into a Base32-encoded string', () => {
      const buffer = Buffer.from('Hello, World!')
      const result = encodeBase32(buffer)
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCC===')
    })

    it('should encode a `string` into a Base32-encoded string', () => {
      const result = encodeBase32('Hello, World!')
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCC===')
    })
  })

  describe('remainder handling', () => {
    it('should encode a buffer to a Base32-encoded string with a remainder of 0', () => {
      const result = encodeBase32('Hello, World!?!')
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCCPZB')
    })

    it('should encode a buffer to a Base32-encoded string with a remainder of 1', () => {
      const result = encodeBase32('Hello, World!?')
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCCPY=')
    })

    it('should encode a buffer to a Base32-encoded string with a remainder of 3', () => {
      const result = encodeBase32('Hello, World!')
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCC===')
    })

    it('should encode a buffer to a Base32-encoded string with a remainder of 4', () => {
      const result = encodeBase32('Hello, World')
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSA====')
    })
  })

  describe('edge cases', () => {
    it('should encode a single byte to a Base32-encoded string', () => {
      const result = encodeBase32([0x10])
      expect(result).toEqual('CA======')
    })

    it('should encode an empty buffer to an empty string', () => {
      const result = encodeBase32([])
      expect(result).toEqual('')
    })
  })
}
