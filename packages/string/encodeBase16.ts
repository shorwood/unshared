/** The Base16 alphabet table as defined in [RFC 4648](https://tools.ietf.org/html/rfc4648#section-8). */
export const BASE_16_ALPHABET = '0123456789abcdef'

/**
 * Encode a `ArrayBuffer` to a Base16-encoded string. Since this implementation is
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
export function encodeBase16(buffer: ArrayBuffer): string {
  const view = new DataView(buffer)
  const bytes: number[] = []

  // --- For every byte in the buffer, convert it to 2 Base16 characters.
  for (let offset = 0; offset < buffer.byteLength; offset++) {
    const byte = view.getUint8(offset)
    const c0 = (byte >> 4) & 0b00001111
    const c1 = byte & 0b00001111
    bytes.push(c0, c1)
  }

  // --- Return result
  return bytes.map(byte => BASE_16_ALPHABET[byte]).join('')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should encode a buffer into a Base16 string', () => {
    const buffer = new TextEncoder().encode('Hello, World!').buffer
    const result = encodeBase16(buffer)
    expect(result).toEqual('48656c6c6f2c20576f726c6421')
  })
}
