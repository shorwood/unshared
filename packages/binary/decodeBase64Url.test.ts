import { decodeBase64Url } from './decodeBase64Url'
import { encodeUtf8 } from './encodeUtf8'

describe('decodeBase64Url', () => {
  test('should decode a Base64 encoded string with padding into a buffer', () => {
    const result = decodeBase64Url('SGVsbG8sIFdvcmxkIQ==')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World!')
  })

  test('should decode a Base64 encoded string without padding into a buffer', () => {
    const result = decodeBase64Url('SGVsbG8sIFdvcmxk')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World')
  })

  test('should replace the URL-safe characters with the original Base64 characters', () => {
    const result = decodeBase64Url('AA-_').toString()
    expect(result).toBe('0,15,191')
  })

  test('should throw if the string contains invalid characters', () => {
    const shouldThrow = () => decodeBase64Url('SGVsbG8sIFdvcmxkIQ!@')
    expect(shouldThrow).toThrow('Could not decode string as Base64: Invalid characters')
  })
})
