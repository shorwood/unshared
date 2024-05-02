/**
 * Check if an array does not include all of the items
 *
 * @param array The array to check
 * @param items The values to look for
 * @returns `true` if the array does not include all of the items, `false` otherwise
 * @example
 * isArrayNotIncludingEvery([], []) // true
 * isArrayNotIncludingEvery([1, 2, 3], [1, 2, 3]) // false
 * isArrayNotIncludingEvery([1, 2, 3], [1, 2, 3, 4]) // true
 * isArrayNotIncludingEvery([1, 2, 3], []) // true
 */
export function isArrayNotIncludingEvery<T>(array: T[], items: T[]): boolean {
  return Array.isArray(array)
    && Array.isArray(items)
    && items.every(item => !array.includes(item))
}

/* v8 ignore start */
if (import.meta.vitest) {
  test.each([

    // --- Returns true
    [true, [1, 2, 3], [4, 5, 6]],
    [true, [1, 2, 3], [4, 5]],
    [true, [1, 2, 3], [4]],
    [true, [1, 2, 3], []],

    // --- Returns false
    [false, [1, 2, 3], [1, 2, 4]],
    [false, [1, 2, 3], [1, 2]],
    [false, [1, 2, 3], [1]],
    [false, [1, 2, 3], [2, 3]],
    [false, [1, 2, 3], [2]],
    [false, [1, 2, 3], [3]],
    [false, [1, 2, 3], 4],

  ])('should return %s when checking if %s is an items not including every items of %s', (expected, value, items: any) => {
    const result = isArrayNotIncludingEvery(value, items)
    expect(result).toEqual(expected)
  })
}
