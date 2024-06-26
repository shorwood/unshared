/**
 * Join all values in an array into a single string. This is a wrapper for the native
 * `Array.join()` but with a default separator of an empty string. It also allows for
 * a more functional style of programming.
 *
 * @param values The values to join.
 * @param separator The character to use as a separator.
 * @returns A single string containing all of the joined values separated by the separator
 * @example join(['a', 'b', 'c'], ',') // => 'a,b,c'
 */
export function join(values: string[], separator = ''): string {
  return values.join(separator)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should join an array of strings', () => {
    const result = join(['a', 'b', 'c'], ',')
    expect(result).toBe('a,b,c')
  })

  test('should join an array of strings with no separator', () => {
    const result = join(['a', 'b', 'c'])
    expect(result).toBe('abc')
  })
}
