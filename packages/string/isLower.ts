/**
 * Checks if a string or character code is lower case. If the value is a string,
 * it must be a single character, otherwise an error is thrown.
 *
 * @param value The string or character code to check.
 * @returns `true` if the string or character code is lower case.
 * @example isLower('a'.charCodeAt(0)) // true
 */
export function isLower(value: number): boolean {
  return value >= 97 && value <= 122
}

/* v8 ignore next */
if (import.meta.vitest) {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{};:,./<>?`~'

  test('should return true for lower case character codes', () => {
    for (const char of lowerCase) {
      const result = isLower(char.charCodeAt(0))
      expect(result).toBe(true)
    }
  })

  test('should return false for non lower case character codes', () => {
    for (const char of upperCase + numbers + symbols) {
      const result = isLower(char.charCodeAt(0))
      expect(result).toBe(false)
    }
  })
}
