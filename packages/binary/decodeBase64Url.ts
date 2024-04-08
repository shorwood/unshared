import { decodeBase64 } from './decodeBase64'

/**
 * Decode a URL-safe Base64-encoded string into an `Uint8Array`. Since this implementation
 * is using the native `Uint8Array` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param base64url The URL-safe Base64 string to decode.
 * @returns The decoded `Uint8Array`.
 * @example
 *
 * // Create a URL-safe Base64 string
 * const base64Url = 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw'
 *
 * // Decode a URL-safe Base64 string to an Uint8Array
 * const buffer = decodeBase64(base64Url) // <Uint8Array 54 68 65 20 71 75 69 63 6b 20 62 72 ...>
 *
 * // Get the string from the buffer
 * const string = new TextDecoder().decode(buffer) // 'The quick brown fox jumps over the lazy dog'
 */
export function decodeBase64Url(base64url: string): Uint8Array {
  const padding = base64url.length % 4
  const base64 = base64url.replaceAll(/[_-]/g, (match) => {
    if (match === '-') return '+'
    if (match === '_') return '/'
    return ''
  })
  return decodeBase64(base64 + '='.repeat(padding))
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

  it('should replace the URL-safe characters with the original Base64 characters', () => {
    const result = decodeBase64Url('AA-_').toString()
    expect(result).toEqual('0,15,191')
  })

  it('should throw if the string contains invalid characters', () => {
    const shouldThrow = () => decodeBase64Url('SGVsbG8sIFdvcmxkIQ!@')
    expect(shouldThrow).toThrow('Could not decode string as Base64: Invalid characters')
  })
}
