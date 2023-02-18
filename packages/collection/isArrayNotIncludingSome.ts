/**
 * Check if an array does not include some of the items
 *
 * @param array The array to check
 * @param items The values to look for
 * @returns `true` if the array does not include some of the items, `false` otherwise
 * @example
 * isArrayNotIncludingSome([], []) // false
 * isArrayNotIncludingSome([1, 2, 3], [1]) // false
 * isArrayNotIncludingSome([1, 2, 3], [1, 2, 3, 4]) // false
 * isArrayNotIncludingSome([1, 2, 3], [4]) // true
 */
export const isArrayNotIncludingSome = <T>(array: T[], items: T[]): boolean =>
  Array.isArray(array)
  && Array.isArray(items)
  && items.some(item => !array.includes(item))

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    // --- Returns true
    [true, [1, 2, 3], [1, 2, 4]],
    [true, [1, 2, 3], [4, 5, 6]],
    [true, [1, 2, 3], [4, 5]],
    [true, [1, 2, 3], [4]],

    // --- Returns false
    [false, [1, 2, 3], []],
    [false, [1, 2, 3], [1, 2]],
    [false, [1, 2, 3], [1]],
    [false, [1, 2, 3], [2, 3]],
    [false, [1, 2, 3], [2]],
    [false, [1, 2, 3], [3]],
    [false, [1, 2, 3], 4],

  ])('should return %s when checking if %s is an items not including some items of %s', (expected, value, items: any) => {
    const result = isArrayNotIncludingSome(value, items)
    expect(result).toEqual(expected)
  })
}
