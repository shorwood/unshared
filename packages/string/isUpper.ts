/**
 * Checks if a string or character code is upper case. If the value is a string,
 * it must be a single character, otherwise an error is thrown.
 *
 * @param value The string or character code to check.
 * @returns `true` if the string or character code is upper case.
 * @example isUpper('A'.charCodeAt(0)) // true
 */
export function isUpper(value: number): boolean {
  return value >= 65 && value <= 90
}

/* c8 ignore next */
if (import.meta.vitest) {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{};:,./<>?`~'

  it('should return true for upper case character codes', () => {
    for (const char of upperCase) {
      const result = isUpper(char.charCodeAt(0))
      expect(result).toEqual(true)
    }
  })

  it('should return false for non upper case character codes', () => {
    for (const char of lowerCase + numbers + symbols) {
      const result = isUpper(char.charCodeAt(0))
      expect(result).toEqual(false)
    }
  })
}
