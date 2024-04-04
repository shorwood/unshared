/** The Base32 alphabet table as defined in [RFC 4648](https://tools.ietf.org/html/rfc4648#section-6). */
export const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Encode a `ArrayBuffer` or `Buffer` into a Base32-encoded string. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param buffer The `ArrayBuffer` to convert.
 * @returns The Base32-encoded string.
 * @example
 *
 * // Create an ArrayBuffer from a string.
 * const buffer = new TextEncoder().encode('The quick brown fox jumps over the lazy dog')
 *
 * // Encode the ArrayBuffer into a Base32 string.
 * encodeBase32(buffer) // 'E5KGQZJAOF2WSY3LEBRHE33XNYQGM33YEBVHK3LQOMQG65TFOIQHI2DFEBWGC6TZEBSG6ZZH'
 */
export function encodeBase32(buffer: Buffer | ArrayBufferLike): string {
  const view = new Uint8Array(buffer)
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
      case 1:  result += B32[c0] + B32[c1] + '======'; break
      case 2:  result += B32[c0] + B32[c1] + B32[c2] + B32[c3] + '===='; break
      case 3:  result += B32[c0] + B32[c1] + B32[c2] + B32[c3] + B32[c4] + '==='; break
      case 4:  result += B32[c0] + B32[c1] + B32[c2] + B32[c3] + B32[c4] + B32[c5] + B32[c6] + '='; break
      default: result += B32[c0] + B32[c1] + B32[c2] + B32[c3] + B32[c4] + B32[c5] + B32[c6] + B32[c7]
    }
  }

  return result
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('input conversion', () => {
    it('should encode an `ArrayBuffer` to a Base32-encoded string', () => {
      const buffer = new TextEncoder().encode('Hello, World').buffer
      const result = encodeBase32(buffer)
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSA====')
    })

    it('should encode a `Buffer` to a Base32-encoded string', () => {
      const buffer = Buffer.from('Hello, World')
      const result = encodeBase32(buffer)
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSA====')
    })
  })

  describe('remainder handling', () => {
    it('should encode a buffer to a Base32-encoded string with a remainder of 0', () => {
      const buffer = new TextEncoder().encode('Hello, World!!!')
      const result = encodeBase32(buffer)
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCCIJB')
    })

    it('should encode a buffer to a Base32-encoded string with a remainder of 1', () => {
      const buffer = new TextEncoder().encode('Hello, World!!')
      const result = encodeBase32(buffer)
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCCII=')
    })

    it('should encode a buffer to a Base32-encoded string with a remainder of 3', () => {
      const buffer = new TextEncoder().encode('Hello, World!')
      const result = encodeBase32(buffer)
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSCC===')
    })

    it('should encode a buffer to a Base32-encoded string with a remainder of 4', () => {
      const buffer = new TextEncoder().encode('Hello, World')
      const result = encodeBase32(buffer)
      expect(result).toEqual('JBSWY3DPFQQFO33SNRSA====')
    })
  })

  describe('edge cases', () => {
    it('should encode a single byte to a Base32-encoded string', () => {
      const buffer = new TextEncoder().encode('A').buffer
      const result = encodeBase32(buffer)
      expect(result).toEqual('IE======')
    })

    it('should encode an empty buffer to an empty string', () => {
      const buffer = new TextEncoder().encode('').buffer
      const result = encodeBase32(buffer)
      expect(result).toEqual('')
    })
  })
}
