import { B64 } from './encodeBase64'

/** Regular expression to test if a string is a valid Base64 string. */
const B64_EXP = /^[\d+/a-z]+=*$/i

/**
 * Decode a Base64-encoded string into an `Uint8Array`. Since this implementation is
 * using the native `Uint8Array` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param base64 The Base64 string to decode.
 * @returns The decoded `Uint8Array`.
 * @example
 *
 * // Create a Base64 string
 * const base64 = 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='
 *
 * // Decode a Base64 string to an Uint8Array
 * const buffer = decodeBase64(base64) // <Uint8Array 54 68 65 20 71 75 69 63 6b 20 62 72 ...>
 *
 * // Get the string from the buffer
 * const string = new TextDecoder().decode(buffer) // 'The quick brown fox jumps over the lazy dog'
 */
export function decodeBase64(base64: string): Uint8Array {
  if (base64.length % 4 !== 0)
    throw new Error('Could not decode string as Base64: Length is not a multiple of 4')
  if (B64_EXP.test(base64) === false)
    throw new Error('Could not decode string as Base64: Invalid characters')

  // --- Handle decode of every 4 characters into 3 bytes.
  const result: number[] = []
  for (let k = 0, v = 0; k < base64.length; k += 4) {
    const c0 = B64.indexOf(base64[k])
    const c1 = B64.indexOf(base64[k + 1])
    const c2 = B64.indexOf(base64[k + 2])
    const c3 = B64.indexOf(base64[k + 3])

    // --- Set the bytes in the buffer.
    result[v++] = ((c0 << 2) & 0b11111100) | ((c1 >> 4) & 0b00000011)
    if (c2 === -1) continue
    result[v++] = ((c1 << 4) & 0b11110000) | ((c2 >> 2) & 0b00001111)
    if (c3 === -1) continue
    result[v++] = ((c2 << 6) & 0b11000000) | (c3 & 0b00111111)
  }

  // --- Return as Uint8Array
  return new Uint8Array(result)
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { encodeUtf8 } = await import('./encodeUtf8')

  it('should decode a Base64 encoded string with padding into a buffer', () => {
    const result = decodeBase64('SGVsbG8sIFdvcmxkIQ==')
    const string = encodeUtf8(result)
    expect(string).toEqual('Hello, World!')
  })

  it('should decode a Base64 encoded string without padding into a buffer', () => {
    const result = decodeBase64('SGVsbG8sIFdvcmxk')
    const string = encodeUtf8(result)
    expect(string).toEqual('Hello, World')
  })

  it('should throw if the string is not a multiple of 4', () => {
    const shouldThrow = () => decodeBase64('123')
    expect(shouldThrow).toThrow('Could not decode string as Base64: Length is not a multiple of 4')
  })

  it('should throw if the string contains non-base64 characters', () => {
    const shouldThrow = () => decodeBase64('AAA!')
    expect(shouldThrow).toThrow('Could not decode string as Base64: Invalid characters')
  })
}
