/**
 * Convert the first letter of a string to uppercase.
 *
 * @param value The string to convert
 * @returns The converted string
 * @throws If `value` is not a string
 * @example capitalize('fooBar') // returns 'FooBar'
 */
export const toCapitalized = (value: string): string => {
  if (value.length === 0) return value
  if (value.length === 1) return value.toUpperCase()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should capitalize the first letter of a string', () => {
    const result = toCapitalized('fooBar')
    expect(result).toEqual('FooBar')
  })

  it('should capitalize a single character', () => {
    const result = toCapitalized('a')
    expect(result).toEqual('A')
  })

  it('should capitalize an empty string', () => {
    const result = toCapitalized('')
    expect(result).toEqual('')
  })
}
