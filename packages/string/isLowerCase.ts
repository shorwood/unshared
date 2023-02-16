/**
 * Checks if a value is an uppercase character.
 *
 * @param value The character or number to check.
 * @returns `true` if the value is an uppercase character.
 * @throws If value is not a character or number.
 * @example isLowerCase('a') // => true
 */
export const isLowerCase = (value: string | number): boolean => {
  // --- Handle edge cases.
  if (typeof value !== 'string' && typeof value !== 'number')
    throw new TypeError(`Expected a string or number, got "${value}".`)
  if (typeof value === 'string' && value.length !== 1)
    throw new TypeError(`Expected a single character, got "${value}".`)

  // --- If the value is a number, check if it is a lowercase character code.
  if (typeof value === 'number') return value >= 97 && value <= 122

  // --- If the value is a string, check if all characters are lowercase.
  for (const char of value) {
    const charCode = char.charCodeAt(0)
    if (charCode < 97 || charCode > 122) return false
  }
  return true
}

/* c8 ignore next */
if (import.meta.vitest) {
  const lowercase = [...'abcdefghijklmnopqrstuvwxyz']
  const uppercase = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
  const lowercaseNumbers = lowercase.map(char => char.charCodeAt(0))
  const uppercaseNumbers = uppercase.map(char => char.charCodeAt(0))

  it('should return true for lowercase characters', () => {
    const result = lowercase.every(isLowerCase)
    expect(result).toEqual(true)
  })

  it('should return false for uppercase characters', () => {
    const result = uppercase.every(isLowerCase)
    expect(result).toEqual(false)
  })

  it('should return true for lowercase character codes', () => {
    const result = lowercaseNumbers.every(isLowerCase)
    expect(result).toEqual(true)
  })

  it('should return false for uppercase character codes', () => {
    const result = uppercaseNumbers.every(isLowerCase)
    expect(result).toEqual(false)
  })

  it('should throw an error if the value is not a string or number', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => isLowerCase({})
    expect(shouldThrow).toThrowError()
  })

  it('should throw an error if the value is a string with more than one character', () => {
    const shouldThrow = () => isLowerCase('foo')
    expect(shouldThrow).toThrowError()
  })

  it('should throw an error if the value is an empty string', () => {
    const shouldThrow = () => isLowerCase('')
    expect(shouldThrow).toThrowError()
  })
}
