/**
 * Join all values in an array into a single string.
 *
 * @param values The values to join.
 * @param separator The character to use as a separator.
 * @returns A single string containing all of the joined values separated by the separator
 * @example join(['a', 'b', 'c'], ',') // => 'a,b,c'
 */
export function join(values: string[], separator = ''): string {
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
}
