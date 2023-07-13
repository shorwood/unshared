/**
 * Check if an array is empty
 *
 * @param array The array to check
 * @returns `true` if the array is empty, `false` otherwise
 * @example
 * isArrayEmpty([]) // true
 * isArrayEmpty([1, 2, 3]) // false
 */
export const isArrayEmpty = (array: unknown[]): array is [] =>
  Array.isArray(array)
  && array.length === 0

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    // --- Returns true
    [true, []],

    // --- Returns false
    [false, [1, 2, 3]],
    [false, ''],
    [false, {}],

  ])('should return %s when checking if %s is an empty array', (expected, value: any) => {
    const result = isArrayEmpty(value)
    expect(result).toEqual(expected)
  })
}
