/**
 * Check if an array does not include item
 *
 * @param array The array to check
 * @param item The array to look for
 * @returns `true` if the array does not include item, `false` otherwise
 * @example
 * isArrayNotIncluding([], 1) // true
 * isArrayNotIncluding([1, 2, 3], 1) // false
 */
export function isArrayNotIncluding<T>(array: T[], item: T): boolean {
  return Array.isArray(array)
    && !array.includes(item)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test.each([

    // --- Returns true
    [true, [1, 2, 3], 4],
    [true, [1, 2, 3], '1'],
    [true, [1, 2, 3], [1, 2, 3]],
    [true, [1, 2, 3], undefined],
    [true, [[]], []],

    // --- Returns false
    [false, [1, 2, 3], 1],
    [false, [1, 2, 3], 2],
    [false, [1, 2, 3], 3],

  ])('should return %s when checking if %s is an array not including %s', (expected, value, item) => {
    const result = isArrayNotIncluding(value, item)
    expect(result).toEqual(expected)
  })
}
