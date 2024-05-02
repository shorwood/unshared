/**
 * Check if an array includes some of the items
 *
 * @param array The array to check
 * @param items The values to look for
 * @returns `true` if the array includes some of the items, `false` otherwise
 * @example
 * isArrayIncludingSome([], []) // false
 * isArrayIncludingSome([1, 2, 3], [1]) // true
 * isArrayIncludingSome([1, 2, 3], [1, 2, 3, 4]) // true
 */
export function isArrayIncludingSome<T>(array: T[], items: T[]): boolean {
  return Array.isArray(array)
    && Array.isArray(items)
    && items.some(item => array.includes(item))
}

/* v8 ignore start */
if (import.meta.vitest) {
  test.each([

    // --- Returns true
    [true, [1, 2, 3], [1]],
    [true, [1, 2, 3], [1, 2, 3]],
    [true, [1, 2, 3], [1, 2, 4]],

    // --- Returns false
    [false, [1, 2, 3], 1],
    [false, [1, 2, 3], []],
    [false, [1, 2, 3], [4]],
    [false, [1, 2, 3], ['1']],

  ])('should return %s when checking if %s is an array including %s', (expected, value, array: any) => {
    const result = isArrayIncludingSome(value, array)
    expect(result).toEqual(expected)
  })
}
