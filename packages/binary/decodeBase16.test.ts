import { decodeBase16 } from './decodeBase16'
import { encodeUtf8 } from './encodeUtf8'

describe('decodeBase16', () => {
  test('should decode uppercase hexadecimal string into a buffer', () => {
    const result = decodeBase16('48656C6C6F2C20576F726C6421')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World!')
  })

  test('should decode lowercase hexadecimal string into a buffer', () => {
    const result = decodeBase16('48656c6c6f2c20576f726c6421')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World!')
  })

  test('should throw if the string is not a multiple of 2', () => {
    const shouldThrow = () => decodeBase16('123')
    expect(shouldThrow).toThrow('Could not decode string as Base16: Length is not a multiple of 2')
  })

  test('should throw if the string contains non-hexadecimal characters', () => {
    const shouldThrow = () => decodeBase16('0G')
    expect(shouldThrow).toThrow('Could not decode string as Base16: Invalid characters')
  })
})
