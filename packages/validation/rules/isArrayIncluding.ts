/**
 * Check if an array includes item
 *
 * @param array The array to check
 * @param item The array to look for
 * @returns `true` if the array includes item, `false` otherwise
 * @example
 * isArrayIncluding([], 1) // false
 * isArrayIncluding([1, 2, 3], 1) // true
 */
export function isArrayIncluding <T>(array: T[], item: T): boolean {
  return Array.isArray(array)
  && array.includes(item)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    // --- Returns true
    [true, [1, 2, 3], 1],
    [true, [1, 2, 3], 2],
    [true, [1, 2, 3], 3],

    // --- Returns false
    [false, [1, 2, 3], 4],
    [false, [1, 2, 3], '1'],
    [false, [1, 2, 3], [1, 2, 3]],
    [false, [1, 2, 3], undefined],
    [false, [[]], []],

  ])('should return %s when checking if %s is an array including %s', (expected, value, item) => {
    const result = isArrayIncluding(value, item)
    expect(result).toEqual(expected)
  })
}
