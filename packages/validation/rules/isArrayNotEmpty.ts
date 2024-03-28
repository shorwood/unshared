/**
 * Check if an array is not empty
 *
 * @param array The array to check
 * @returns `true` if the array is not empty, `false` otherwise
 * @example
 * isArrayNotEmpty([]) // false
 * isArrayNotEmpty([1, 2, 3]) // true
 */
export function isArrayNotEmpty(array: any[]): boolean {
  return Array.isArray(array)
  && array.length > 0
}

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    // --- Returns true
    [true, [1, 2, 3]],

    // --- Returns false
    [false, []],
    [false, ''],
    [false, {}],
    [false, { a: 1 }],

  ])('should return %s when checking if %s is not an empty array', (expected, value: any) => {
    const result = isArrayNotEmpty(value)
    expect(result).toEqual(expected)
  })
}
