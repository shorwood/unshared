/** The Base16 alphabet table as defined in [RFC 4648](https://tools.ietf.org/html/rfc4648#section-8). */
export const B16 = '0123456789abcdef'

/**
 * Encode a `ArrayBuffer` or `Buffer` into a Base16-encoded string. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param buffer The `ArrayBuffer` to convert.
 * @returns The Base16-encoded string.
 * @example
 *
 * // Create an ArrayBuffer from a string.
 * const buffer = new TextEncoder().encode('The quick brown fox jumps over the lazy dog')
 *
 * // Encode the ArrayBuffer into a Base16 string.
 * encodeBase16(buffer) // '54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f67'
 */
export function encodeBase16(buffer: Buffer | ArrayBuffer): string {
  const view = new Uint8Array(buffer)
  let result = ''

  // --- For every byte in the buffer, convert it to 2 Base16 characters.
  for (let offset = 0; offset < buffer.byteLength; offset++) {
    const byte = view[offset]
    const c0 = (byte >> 4) & 0b00001111
    const c1 = byte & 0b00001111
    result += B16[c0] + B16[c1]
  }

  return result
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('input conversion', () => {
    it('should encode an `ArrayBuffer` to a Base16-encoded string', () => {
      const buffer = new TextEncoder().encode('Hello, World').buffer
      const result = encodeBase16(buffer)
      expect(result).toEqual('48656c6c6f2c20576f726c64')
    })

    it('should encode a `Buffer` to a Base16-encoded string', () => {
      const buffer = Buffer.from('Hello, World')
      const result = encodeBase16(buffer)
      expect(result).toEqual('48656c6c6f2c20576f726c64')
    })
  })

  describe('edge cases', () => {
    it('should encode an empty buffer', () => {
      const buffer = new ArrayBuffer(0)
      const result = encodeBase16(buffer)
      expect(result).toEqual('')
    })

    it('should encode a buffer with a single byte', () => {
      const buffer = new Uint8Array([0x12])
      const result = encodeBase16(buffer)
      expect(result).toEqual('12')
    })
  })
}
