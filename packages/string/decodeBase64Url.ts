import { decodeBase64 } from './decodeBase64'

/**
 * Decode a URL-safe Base64-encoded string into an `ArrayBuffer`. Since this implementation
 * is using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param base64url The URL-safe Base64 string to decode.
 * @returns The decoded `ArrayBuffer`.
 * @example
 *
 * // Create a URL-safe Base64 string
 * const base64Url = 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw'
 *
 * // Decode a URL-safe Base64 string to an ArrayBuffer
 * const buffer = decodeBase64(base64Url) // <ArrayBuffer 54 68 65 20 71 75 69 63 6b 20 62 72 ...>
 *
 * // Get the string from the buffer
 * const string = new TextDecoder().decode(buffer) // 'The quick brown fox jumps over the lazy dog'
 */
export function decodeBase64Url(base64url: string): ArrayBuffer {
  const padding = base64url.length % 4
  const base64 = base64url.replace(/[_-]/g, (match) => {
    if (match === '-') return '+'
    if (match === '_') return '/'
    return ''
  })
  return decodeBase64(base64 + '='.repeat(padding))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should decode a Base64 encoded string with padding into a buffer', () => {
    const result = decodeBase64Url('VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw')
    const resultUtf8 = new TextDecoder().decode(result)
    const expected = 'The quick brown fox jumps over the lazy dog'
    expect(resultUtf8).toEqual(expected)
  })

  it('should replace the URL-safe characters with the original Base64 characters', () => {
    const result = decodeBase64Url('AA-_')
    const expected = new Uint8Array([0x00, 0x0F, 0xBF]).buffer
    expect(result).toEqual(expected)
  })

  it('should throw if the string contains invalid characters', () => {
    const shouldThrow = () => decodeBase64Url('SGVsbG8sIFdvcmxkIQ!@')
    expect(shouldThrow).toThrow(Error)
  })
}
