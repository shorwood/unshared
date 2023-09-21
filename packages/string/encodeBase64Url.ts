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
 * // Create a buffer from a string
 * const buffer = new TextEncoder().encode('The quick brown fox jumps over the lazy dog')
 *
 * // Encode a string to Base64
 * encodeBase64Url(buffer) // 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw'
 */
export function encodeBase64Url(buffer: ArrayBuffer): string {
  return encodeBase64(buffer)
    .replace(/\+|\/|=+$/g, (match) => {
      if (match === '+') return '-'
      if (match === '/') return '_'
      return ''
    })
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should encode a buffer into a URL-safe Base64', () => {
    const buffer = Buffer.from([0x00, 0x0F, 0xBF])
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
    const result = encodeBase64Url(arrayBuffer)
    expect(result).toEqual('AA-_')
  })

  it('should encode a buffer into a URL-safe Base64 string and omit padding', () => {
    const buffer = new TextEncoder().encode('Hello, World!').buffer
    const result = encodeBase64Url(buffer)
    expect(result).toEqual('SGVsbG8sIFdvcmxkIQ')
  })
}
