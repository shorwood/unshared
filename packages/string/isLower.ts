/**
 * Checks if a string or character code is lower case. If the value is a string,
 * it must be a single character, otherwise an error is thrown.
 *
 * @param value The string or character code to check.
 * @returns `true` if the string or character code is lower case.
 * @example isLower('a') // returns true
 */
export function isLower(value: string): value is Lowercase<string>
export function isLower(value: string | number): boolean
export function isLower(value: string | number): boolean {
  if (typeof value === 'number') return value >= 97 && value <= 122
  if (value.length !== 1) throw new SyntaxError('Expected a single character')
  const char = value.charCodeAt(0)
  return char >= 97 && char <= 122
}

/* c8 ignore next */
if (import.meta.vitest) {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{};:,./<>?`~'

  it('should return true for lower case characters', () => {
    for (const char of lowerCase) {
      const result = isLower(char)
      expect(result).toEqual(true)
    }
  })

  it('should return false for non lower case characters', () => {
    for (const char of upperCase + numbers + symbols) {
      const result = isLower(char)
      expect(result).toEqual(false)
    }
  })

  it('should return true for lower case character codes', () => {
    for (const char of lowerCase) {
      const result = isLower(char.charCodeAt(0))
      expect(result).toEqual(true)
    }
  })

  it('should return false for non lower case character codes', () => {
    for (const char of upperCase + numbers + symbols) {
      const result = isLower(char.charCodeAt(0))
      expect(result).toEqual(false)
    }
  })

  it('should throw an error for a string with more than one character', () => {
    const shouldThrow = () => isLower('foo')
    expect(shouldThrow).toThrow(/single character/)
  })

  it('should predicate guard for lower case string', () => {
    const string = 'a' as 'a' | 'A'
    const result = isLower(string)
    if (result) expectTypeOf(string).toEqualTypeOf<'a'>()
  })
}
