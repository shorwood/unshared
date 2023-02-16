/**
 * Join all values in an array into a single string
 *
 * @param values The values to join
 * @param separator The character to use as a separator
 * @returns A single string containing all of the joined values
 * @throws If values is not an array of strings or if separator is not a string
 * @example join(['a', 'b', 'c'], ',') // => 'a,b,c'
 */
export function join(values: string[], separator = ''): string {
  if (!Array.isArray(values))
    throw new TypeError('Expected an array of strings')
  if (values.some(value => typeof value !== 'string'))
    throw new TypeError('Expected an array of strings')
  if (typeof separator !== 'string')
    throw new TypeError('Expected separator to be a string')

  // --- Join the values.
  return values.join(separator)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should join an array of strings', () => {
    const result = join(['a', 'b', 'c'], ',')
    expect(result).toEqual('a,b,c')
  })

  it('should join an array of strings with no separator', () => {
    const result = join(['a', 'b', 'c'])
    expect(result).toEqual('abc')
  })

  it('should throw if values is not an array', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => join('a,b,c', ',')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if values is not an array of strings', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => join([1, 2, 3], ',')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if separator is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => join(['a', 'b', 'c'], 1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
