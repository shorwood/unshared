/** The Base64 alphabet table as defined in [RFC 4648](https://tools.ietf.org/html/rfc4648#section-4). */
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/**
 * Encode a `ArrayBuffer` or `Buffer` into a Base64-encoded string. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param buffer The `ArrayBuffer` to convert.
 * @returns The Base64-encoded string.
 * @example
 *
 * // Create an ArrayBuffer from a string.
 * const buffer = new TextEncoder().encode('The quick brown fox jumps over the lazy dog')
 *
 * // Encode the ArrayBuffer into a Base64 string.
 * encodeBase64(buffer) // 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='
 */
export function encodeBase64(buffer: ArrayBufferLike | Buffer): string {
  const view = new Uint8Array(buffer)
  let result = ''

  // --- Loop over every byte in the Buffer in 3-byte chunks.
  for (let i = 0; i < view.byteLength; i += 3) {
    const remaining = view.byteLength - i

    // --- Get 3 bytes from the buffer.
    if (remaining === 0) break
    const byte1 = view[i]
    const byte2 = (remaining > 1) ? view[i + 1] : 0
    const byte3 = (remaining > 2) ? view[i + 2] : 0

    // --- Convert the 3 bytes into 4 Base64 characters
    const c0 = ((byte1 >> 2) & 0b00111111)
    const c1 = ((byte1 << 4) & 0b00110000) | ((byte2 >> 4) & 0b00001111)
    const c2 = ((byte2 << 2) & 0b00111100) | ((byte3 >> 6) & 0b00000011)
    const c3 = byte3 & 0b00111111

    // --- Append the 4 Base64 characters to the result
    switch (remaining) {
      case 1: { result += `${B64[c0] + B64[c1]}==`; break }
      case 2: { result += `${B64[c0] + B64[c1] + B64[c2]}=`; break }
      default: { result += B64[c0] + B64[c1] + B64[c2] + B64[c3] }
    }
  }

  return result
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('input conversion', () => {
    it('should encode an `ArrayBuffer` to a Base64-encoded string', () => {
      const buffer = new TextEncoder().encode('Hello, World').buffer
      const result = encodeBase64(buffer)
      expect(result).toEqual('SGVsbG8sIFdvcmxk')
    })

    it('should encode a `Buffer` to a Base64-encoded string', () => {
      const buffer = Buffer.from('Hello, World')
      const result = encodeBase64(buffer)
      expect(result).toEqual('SGVsbG8sIFdvcmxk')
    })
  })

  describe('remainder handling', () => {
    it('should encode a buffer to a Base64-encoded string with a remainder of 0', () => {
      const buffer = new TextEncoder().encode('Hello, World')
      const result = encodeBase64(buffer)
      expect(result).toEqual('SGVsbG8sIFdvcmxk')
    })

    it('should encode a buffer to a Base64-encoded string with a remainder of 1', () => {
      const buffer = new TextEncoder().encode('Hello, World!!')
      const result = encodeBase64(buffer)
      expect(result).toEqual('SGVsbG8sIFdvcmxkISE=')
    })

    it('should encode a buffer to a Base64-encoded string with a remainder of 2', () => {
      const buffer = new TextEncoder().encode('Hello, World!')
      const result = encodeBase64(buffer)
      expect(result).toEqual('SGVsbG8sIFdvcmxkIQ==')
    })
  })

  describe('edge cases', () => {
    it('should encode a 3-byte buffer to a Base64-encoded string', () => {
      const buffer = new Uint8Array([0x00, 0x0F, 0xBF])
      const result = encodeBase64(buffer)
      expect(result).toEqual('AA+/')
    })

    it('should encode a single byte to a Base64-encoded string', () => {
      const buffer = new TextEncoder().encode('A')
      const result = encodeBase64(buffer)
      expect(result).toEqual('QQ==')
    })

    it('should encode an empty buffer to an empty string', () => {
      const buffer = new TextEncoder().encode('')
      const result = encodeBase64(buffer)
      expect(result).toEqual('')
    })
  })
}
