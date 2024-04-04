import { encodeBase64 } from './encodeBase64'

/**
 * Encode a `ArrayBuffer` to a Base64 URL-safe encoded string. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param buffer The `ArrayBuffer` to convert.
 * @returns The Base64 URL-safe encoded string.
 * @example
 *
 * // Create an ArrayBuffer from a string.
 * const buffer = new TextEncoder().encode('The quick brown fox jumps over the lazy dog')
 *
 * // Encode the ArrayBuffer into an URL-safe Base64 string.
 * encodeBase64Url(buffer) // 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw'
 */
export function encodeBase64Url(buffer: Buffer | ArrayBuffer): string {
  return encodeBase64(buffer)
    .replaceAll(/\+|\/|=+$/g, (match) => {
      if (match === '+') return '-'
      if (match === '/') return '_'
      return ''
    })
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should encode a `Buffer` into a URL-safe Base64', () => {
    const buffer = Buffer.from([0x00, 0x0F, 0xBF])
    const result = encodeBase64Url(buffer)
    expect(result).toEqual('AA-_')
  })

  it('should encode an `ArrayBuffer` into a URL-safe Base64', () => {
    const buffer = new TextEncoder().encode('Hello, World!').buffer
    const result = encodeBase64Url(buffer)
    expect(result).toEqual('SGVsbG8sIFdvcmxkIQ')
  })

  it('should encode a buffer into a URL-safe Base64 string and omit padding', () => {
    const buffer = new TextEncoder().encode('Hello, World!').buffer
    const result = encodeBase64Url(buffer)
    expect(result).toEqual('SGVsbG8sIFdvcmxkIQ')
  })
}
