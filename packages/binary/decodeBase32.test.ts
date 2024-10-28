import { decodeBase32 } from './decodeBase32'
import { encodeUtf8 } from './encodeUtf8'

describe('decodeBase32', () => {
  test('should decode a Base64 encoded string with padding into a buffer', () => {
    const result = decodeBase32('JBSWY3DPFQQFO33SNRSCC===')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World!')
  })

  test('should decode a Base64 encoded string without padding into a buffer', () => {
    const result = decodeBase32('JBSWY3DPFQQFO33SNRSCCIJB')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World!!!')
  })

  test('should throw if the string is not a multiple of 8', () => {
    const shouldThrow = () => decodeBase32('JBSWY3DPFQQFO33SNRSCCIJ')
    expect(shouldThrow).toThrow('Could not decode string as Base32: Length is not a multiple of 8')
  })

  test('should throw if the string contains invalid characters', () => {
    const shouldThrow = () => decodeBase32('JBSWY3DPFQQFO33SNRSCCIJ#')
    expect(shouldThrow).toThrow('Could not decode string as Base32: Invalid characters')
  })
})
