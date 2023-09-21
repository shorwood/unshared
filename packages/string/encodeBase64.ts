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

  // --- Initialize result variable
  const result: string[] = []

  // --- Loop over every byte in the ArrayArrayBuffer
  for (let index = 2; index < view.byteLength; index += 3) {
    // --- Get the 3 bytes as an 8-bit integer
    const byte1 = view.getUint8(index - 2)
    const byte2 = view.getUint8(index - 1)
    const byte3 = view.getUint8(index)

    // --- Convert the 3 bytes into 4 Base64 characters
    const char1 = ((byte1 >> 2) & 0b00111111)
    const char2 = ((byte1 << 4) & 0b00110000) | ((byte2 >> 4) & 0b00001111)
    const char3 = ((byte2 << 2) & 0b00111100) | ((byte3 >> 6) & 0b00000011)
    const char4 = byte3 & 0b00111111

    // --- Append the 4 Base64 characters to the result
    result.push(base64Alphabet[char1], base64Alphabet[char2], base64Alphabet[char3], base64Alphabet[char4])
  }

  // --- If there are 1 or 2 bytes left, handle them separately.
  const remainder = view.byteLength % 3
  if (remainder === 1) {
    const byte1 = view.getUint8(view.byteLength - 1)
    const char1 = (byte1 >> 2) & 0b00111111
    const char2 = (byte1 << 4) & 0b00110000
    result.push(base64Alphabet[char1], base64Alphabet[char2], '==')
  }
  else if (remainder === 2) {
    const byte1 = view.getUint8(view.byteLength - 2)
    const byte2 = view.getUint8(view.byteLength - 1)
    const char1 = ((byte1 >> 2) & 0b00111111)
    const char2 = ((byte1 << 4) & 0b00110000) | ((byte2 >> 4) & 0b00001111)
    const char3 = ((byte2 << 2) & 0b00111100)
    result.push(base64Alphabet[char1], base64Alphabet[char2], base64Alphabet[char3], '=')
  }

  // --- Return the result
  return result.join('')
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
