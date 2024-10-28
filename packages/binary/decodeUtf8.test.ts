import { decodeUtf8 } from './decodeUtf8'

describe('decodeUtf8', () => {
  test('should decode a UTF8 string into a buffer', () => {
    const result = decodeUtf8('Hello, World!')
    const buffer = Buffer.from(result).toString()
    expect(buffer).toBe('Hello, World!')
  })
})
