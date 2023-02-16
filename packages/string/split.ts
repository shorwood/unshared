/**
 * Split the string into an array of substrings
 *
 * @param value The string to split
 * @param separator
 * A string that identifies character or characters to use in separating the string.
 * If omitted, a single-element array containing the entire string is returned.
 * @param limit A value used to limit the number of elements returned in the array.
 * @returns
 * An array containing the substrings from the original string that are found
 * at the start of the string and are separated by the specified separator string.
 * @example
 * split('a,b,c', ',') // => ['a', 'b', 'c']
 * split('a,b,c', ',', 2) // => ['a', 'b']
 * split('a,b,c', ',', -2) // => ['b', 'c']
 */
export const split = (value: string, separator: string | RegExp, limit?: number): string[] => {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')
  if (typeof limit === 'number' && !Number.isInteger(limit))
    throw new TypeError('Expected an integer')

  // --- Split the string.
  if (!limit) return value.split(separator)
  if (limit > 0) return value.split(separator, limit)
  return value.split(separator).slice(limit)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should split a string', () => {
    const result = split('a,b,c', ',')
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should split a string with a limit', () => {
    const result = split('a,b,c', ',', 2)
    expect(result).toEqual(['a', 'b'])
  })

  it('should split a string with a negative limit', () => {
    const result = split('a,b,c', ',', -2)
    expect(result).toEqual(['b', 'c'])
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => split(1, ',')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if limit is not an integer', () => {
    const shouldThrow = () => split('a,b,c', ',', 1.1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
