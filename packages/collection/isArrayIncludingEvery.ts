/**
 * Check if an array includes all of the items
 *
 * @param array The array to check
 * @param items The values to look for
 * @returns `true` if the array includes all of the items, `false` otherwise
 * @example
 * isArrayIncludingEvery([], []) // true
 * isArrayIncludingEvery([1, 2, 3], [1]) // true
 * isArrayIncludingEvery([1, 2, 3], [1, 2, 3, 4]) // false
 */
export const isArrayIncludingEvery = <T>(array: unknown[], items: T[]): array is T[] =>
  Array.isArray(array)
  && Array.isArray(items)
  && items.every(item => array.includes(item))

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    // --- Returns true
    [true, [1, 2, 3], [1, 2, 3]],
    [true, [1, 2, 3], [1, 2]],
    [true, [1, 2, 3], [1]],
    [true, [1, 2, 3], []],

    // --- Returns false
    [false, [1, 2, 3], [1, 2, 4]],
    [false, [1, 2, 3], 4],
    [false, [1, 2, 3], '123'],

  ])('should return %s when checking if %s is an items including every %s', (expected, value, items: any) => {
    const result = isArrayIncludingEvery(value, items)
    expect(result).toEqual(expected)
  })
}
