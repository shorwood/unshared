import { BASE_64_ALPHABET } from './encodeBase64'

/** Regular expression to test if a string is a valid Base64 string. */
const BASE_64_REGEXP = /^[\d+/a-z]+=*$/i

/**
 * Decode a Base64-encoded string into an `ArrayBuffer`. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param base64 The Base64 string to decode.
 * @returns The decoded `ArrayBuffer`.
 * @example
 *
 * // Create a Base64 string
 * const base64 = 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='
 *
 * // Decode a Base64 string to an ArrayBuffer
 * const buffer = decodeBase64(base64) // <ArrayBuffer 54 68 65 20 71 75 69 63 6b 20 62 72 ...>
 *
 * // Get the string from the buffer
 * const string = new TextDecoder().decode(buffer) // 'The quick brown fox jumps over the lazy dog'
 */
export function decodeBase64(base64: string): ArrayBuffer {
  if (base64.length % 4 !== 0)
    throw new Error('Could not decode string as Base64: Length is not a multiple of 4')
  if (BASE_64_REGEXP.test(base64) === false)
    throw new Error('Could not decode string as Base64: Invalid characters')

  // --- Handle decode of every 4 characters into 3 bytes.
  const bytes: number[] = []
  for (let k = 0, v = 0; k < base64.length; k += 4) {
    const c0 = BASE_64_ALPHABET.indexOf(base64[k])
    const c1 = BASE_64_ALPHABET.indexOf(base64[k + 1])
    const c2 = BASE_64_ALPHABET.indexOf(base64[k + 2])
    const c3 = BASE_64_ALPHABET.indexOf(base64[k + 3])

    // --- Set the bytes in the buffer.
    bytes[v++] = ((c0 << 2) & 0b11111100) | ((c1 >> 4) & 0b00000011)
    if (c2 === -1) continue
    bytes[v++] = ((c1 << 4) & 0b11110000) | ((c2 >> 2) & 0b00001111)
    if (c3 === -1) continue
    bytes[v++] = ((c2 << 6) & 0b11000000) | (c3 & 0b00111111)
  }

  // --- Return as ArrayBuffer
  return new Uint8Array(bytes).buffer
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should decode a Base64 encoded string with padding into a buffer', () => {
    const result = decodeBase64('VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==')
    const resultUtf8 = new TextDecoder().decode(result)
    const expected = 'The quick brown fox jumps over the lazy dog'
    expect(resultUtf8).toEqual(expected)
  })

  it('should decode a Base64 encoded string without padding into a buffer', () => {
    const result = decodeBase64('SGVsbG8sIFdvcmxk')
    const resultUtf8 = new TextDecoder().decode(result)
    const expected = 'Hello, World'
    expect(resultUtf8).toEqual(expected)
  })

  it('should throw if the string is not a multiple of 4', () => {
    const shouldThrow = () => decodeBase64('SGVsbG8sIFdvcmxkIQ=')
    expect(shouldThrow).toThrow(Error)
  })

  it('should throw if the string contains invalid characters', () => {
    const shouldThrow = () => decodeBase64('SGVsbG8sIFdvcmxkIQ!@')
    expect(shouldThrow).toThrow(Error)
  })
}
