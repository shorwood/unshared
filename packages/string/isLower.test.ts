import { isLower } from './isLower'

describe('isLower', () => {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{};:,./<>?`~'

  test('should return true for lower case character codes', () => {
    for (const char of lowerCase) {
      const result = isLower(char.codePointAt(0)!)
      expect(result).toBe(true)
    }
  })

  test('should return true for lower case characters', () => {
    for (const char of lowerCase) {
      const result = isLower(char)
      expect(result).toBe(true)
    }
  })

  test('should return false for non lower case character codes', () => {
    for (const char of upperCase + numbers + symbols) {
      const result = isLower(char.codePointAt(0)!)
      expect(result).toBe(false)
    }
  })

  test('should return false for non lower case characters', () => {
    for (const char of upperCase + numbers + symbols) {
      const result = isLower(char)
      expect(result).toBe(false)
    }
  })

  test('should return false for empty string', () => {
    const result = isLower('')
    expect(result).toBe(false)
  })
})
