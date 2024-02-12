/**
 * Returns a new array with only unique values from the given array.
 *
 * @param array The array to get unique values from
 * @returns A new array with unique values
 */
export const uniq = <T>(array: T[]): T[] => [...new Set(array)]

/** c8 ignore next */
if (import.meta.vitest) {
  it('returns a new array with only unique values from the given array', () => {
    expect(uniq([1, 2, 3, 3, 4, 4, 5])).toEqual([1, 2, 3, 4, 5])
    expect(uniq(['a', 'a', 'b', 'b', 'c', 'c'])).toEqual(['a', 'b', 'c'])
  })
}
