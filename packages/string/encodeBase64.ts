/** The Base64 alphabet table as defined in [RFC 4648](https://tools.ietf.org/html/rfc4648#section-4). */
export const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/**
 * Encode a `ArrayBuffer` to a Base64-encoded string. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param buffer The `ArrayBuffer` to convert.
 * @returns The Base64-encoded string.
 * @example
 *
 * // Create a buffer from a string
 * const buffer = new TextEncoder().encode('The quick brown fox jumps over the lazy dog')
 *
 * // Encode a string to Base64
 * encodeBase64(buffer) // 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='
 */
export function encodeBase64(buffer: ArrayBuffer): string {
  const view = new DataView(buffer)
  const bytes: number[] = []
  const remainder = view.byteLength % 3

  // --- Loop over every byte in the ArrayArrayBuffer
  for (let offset = 2; offset < view.byteLength + 3; offset += 3) {
    const inBounds = offset < view.byteLength

    // --- Exit the loop if the remainder is 0 and the offset is out of bounds.
    if (remainder === 0 && !inBounds) break

    // --- Get 3 bytes from the buffer.
    const byte1 = (inBounds || remainder > 0) ? view.getUint8(offset - 2) : 0
    const byte2 = (inBounds || remainder > 1) ? view.getUint8(offset - 1) : 0
    const byte3 = (inBounds || remainder > 2) ? view.getUint8(offset) : 0

    // --- Convert the 3 bytes into 4 Base64 characters
    const c0 = ((byte1 >> 2) & 0b00111111)
    const c1 = ((byte1 << 4) & 0b00110000) | ((byte2 >> 4) & 0b00001111)
    const c2 = ((byte2 << 2) & 0b00111100) | ((byte3 >> 6) & 0b00000011)
    const c3 = byte3 & 0b00111111

    // --- Append the 4 Base64 characters to the result
    bytes.push(c0, c1, c2, c3)
  }

  // --- If there is a remainder, clip to length and pad the result with '='.
  if (remainder > 0) {
    const bytesLength = Math.ceil(view.byteLength * 4 / 3)
    const bytesClipped = bytes.slice(0, bytesLength)
    const lengthPadding = 4 - bytesLength % 4
    return bytesClipped.map(byte => base64Alphabet[byte]).join('') + '='.repeat(lengthPadding)
  }

  // --- Return the result.
  return bytes.map(byte => base64Alphabet[byte]).join('')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should use the standard Base64 alphabet', () => {
    const buffer = Buffer.from([0x00, 0x0F, 0xBF])
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
    const result = encodeBase64(arrayBuffer)
    expect(result).toEqual('AA+/')
  })

  it('should encode a buffer to a Base64-encoded string with a remainder of 0', () => {
    const buffer = new TextEncoder().encode('Hello, World').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('SGVsbG8sIFdvcmxk')
  })

  it('should encode a buffer to a Base64-encoded string with a remainder of 2', () => {
    const buffer = new TextEncoder().encode('Hello, World!').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('SGVsbG8sIFdvcmxkIQ==')
  })

  it('should encode a buffer to a Base64-encoded string with a remainder of 1', () => {
    const buffer = new TextEncoder().encode('Hello, World!!').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('SGVsbG8sIFdvcmxkISE=')
  })

  it('should encode a single byte to a Base64-encoded string', () => {
    const buffer = new TextEncoder().encode('A').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('QQ==')
  })

  it('should encode an empty buffer to an empty string', () => {
    const buffer = new TextEncoder().encode('').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('')
  })
}
