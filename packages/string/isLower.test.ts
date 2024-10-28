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

  test('should return false for non lower case character codes', () => {
    for (const char of upperCase + numbers + symbols) {
      const result = isLower(char.codePointAt(0)!)
      expect(result).toBe(false)
    }
  })
})
