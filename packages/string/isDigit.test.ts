import { isDigit } from './isDigit'

describe('isDigit', () => {
  const digits = '0123456789'
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const symbols = '!@#$%^&*()_+-=[]{};:,./<>?`~'

  test('should return true for digit character codes', () => {
    for (const char of digits) {
      const result = isDigit(char.codePointAt(0)!)
      expect(result).toBe(true)
    }
  })

  test('should return true for digit characters', () => {
    for (const char of digits) {
      const result = isDigit(char)
      expect(result).toBe(true)
    }
  })

  test('should return false for non digit character codes', () => {
    for (const char of upperCase + lowerCase + symbols) {
      const result = isDigit(char.codePointAt(0)!)
      expect(result).toBe(false)
    }
  })

  test('should return false for non digit characters', () => {
    for (const char of upperCase + lowerCase + symbols) {
      const result = isDigit(char)
      expect(result).toBe(false)
    }
  })

  test('should return false for empty string', () => {
    const result = isDigit('')
    expect(result).toBe(false)
  })
})
