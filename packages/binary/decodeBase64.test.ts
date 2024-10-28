import { decodeBase64 } from './decodeBase64'
import { encodeUtf8 } from './encodeUtf8'

describe('decodeBase64', () => {
  test('should decode a Base64 encoded string with padding into a buffer', () => {
    const result = decodeBase64('SGVsbG8sIFdvcmxkIQ==')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World!')
  })

  test('should decode a Base64 encoded string without padding into a buffer', () => {
    const result = decodeBase64('SGVsbG8sIFdvcmxk')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World')
  })

  test('should throw if the string is not a multiple of 4', () => {
    const shouldThrow = () => decodeBase64('123')
    expect(shouldThrow).toThrow('Could not decode string as Base64: Length is not a multiple of 4')
  })

  test('should throw if the string contains non-base64 characters', () => {
    const shouldThrow = () => decodeBase64('AAA!')
    expect(shouldThrow).toThrow('Could not decode string as Base64: Invalid characters')
  })
})
