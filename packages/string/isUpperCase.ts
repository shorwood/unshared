/**
 * Checks if a value is an uppercase character.
 *
 * @param value The character or number to check.
 * @returns `true` if the value is an uppercase character.
 * @throws If value is not a character or number.
 * @example isUpperCase('A') // => true
 */
export const isUpperCase = (value: string | number): boolean => {
  // --- Handle edge cases.
  if (typeof value !== 'string' && typeof value !== 'number')
    throw new TypeError(`Expected a string or number, got "${value}".`)
  if (typeof value === 'string' && value.length !== 1)
    throw new TypeError(`Expected a single character, got "${value}".`)

  // --- If the value is a number, check if it is a uppercase character code.
  if (typeof value === 'number') return value >= 65 && value <= 90

  // --- If the value is a string, check if all characters are uppercase.
  for (const char of value) {
    const charCode = char.charCodeAt(0)
    if (charCode < 65 || charCode > 90) return false
  }
  return true
}

/* c8 ignore next */
if (import.meta.vitest) {
  const lowercase = [...'abcdefghijklmnopqrstuvwxyz']
  const uppercase = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
  const lowercaseNumbers = lowercase.map(char => char.charCodeAt(0))
  const uppercaseNumbers = uppercase.map(char => char.charCodeAt(0))

  it('should return false for lowercase characters', () => {
    const result = lowercase.every(isUpperCase)
    expect(result).toEqual(false)
  })

  it('should return true for uppercase characters', () => {
    const result = uppercase.every(isUpperCase)
    expect(result).toEqual(true)
  })

  it('should return false for lowercase character codes', () => {
    const result = lowercaseNumbers.every(isUpperCase)
    expect(result).toEqual(false)
  })

  it('should return true for uppercase character codes', () => {
    const result = uppercaseNumbers.every(isUpperCase)
    expect(result).toEqual(true)
  })

  it('should throw an error if the value is not a string or number', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => isUpperCase({})
    expect(shouldThrow).toThrowError()
  })

  it('should throw an error if the value is a string with more than one character', () => {
    const shouldThrow = () => isUpperCase('foo')
    expect(shouldThrow).toThrowError()
  })

  it('should throw an error if the value is an empty string', () => {
    const shouldThrow = () => isUpperCase('')
    expect(shouldThrow).toThrowError()
  })
}
