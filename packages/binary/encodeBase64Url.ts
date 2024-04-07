import { encodeBase64 } from './encodeBase64'
import { BinaryLike } from './toUint8Array'

/**
 * Encode a `BinaryLike` into a Base64-encoded string. This implementation is
 * agnostic to the environment and can be used in both Node.js and browsers.
 *
 * @param value The value to encode.
 * @returns The Base64-encoded string.
 * @example encodeBase64Url('Hello, World!') // 'SGVsbG8sIFdvcmxkIQ'
 */
export function encodeBase64Url(value: BinaryLike): string {
  return encodeBase64(value)
    .replaceAll(/\+|\/|=+$/g, (match) => {
      if (match === '+') return '-'
      if (match === '/') return '_'
      return ''
    })
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should encode a `Buffer` into a URL-safe Base64', () => {
    const result = encodeBase64Url([0x00, 0x0F, 0xBF])
    expect(result).toEqual('AA-_')
  })

  it('should encode an `ArrayBuffer` into a URL-safe Base64', () => {
    const result = encodeBase64Url('Hello, World!')
    expect(result).toEqual('SGVsbG8sIFdvcmxkIQ')
  })

  it('should encode a buffer into a URL-safe Base64 string and omit padding', () => {
    const result = encodeBase64Url('Hello, World!')
    expect(result).toEqual('SGVsbG8sIFdvcmxkIQ')
  })
}
