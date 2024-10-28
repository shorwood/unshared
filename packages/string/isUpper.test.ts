import { isUpper } from './isUpper'

describe('isUpper', () => {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{};:,./<>?`~'

  test('should return true for upper case character codes', () => {
    for (const char of upperCase) {
      const result = isUpper(char.charCodeAt(0))
      expect(result).toBe(true)
    }
  })

  test('should return false for non upper case character codes', () => {
    for (const char of lowerCase + numbers + symbols) {
      const result = isUpper(char.charCodeAt(0))
      expect(result).toBe(false)
    }
  })
})
