import { encodeBase64Url } from './encodeBase64Url'

describe('encodeBase64Url', () => {
  test('should encode a `Buffer` into a URL-safe Base64', () => {
    const result = encodeBase64Url([0x00, 0x0F, 0xBF])
    expect(result).toBe('AA-_')
  })

  test('should remove padding from the URL-safe Base64 string', () => {
    const result = encodeBase64Url([0x01])
    expect(result).toBe('AQ')
  })

  test('should encode an `ArrayBuffer` into a URL-safe Base64', () => {
    const result = encodeBase64Url('Hello, World!')
    expect(result).toBe('SGVsbG8sIFdvcmxkIQ')
  })

  test('should encode a buffer into a URL-safe Base64 string and omit padding', () => {
    const result = encodeBase64Url('Hello, World!')
    expect(result).toBe('SGVsbG8sIFdvcmxkIQ')
  })
})
