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
export function isArrayIncluding<T>(array: T[], item: T): boolean {
  return array.includes(item)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should return false if the array is empty', () => {
    const result = isArrayIncluding([], 1)
    expect(result).toBeFalsy()
  })

  test('should return true if the array includes the item', () => {
    const result = isArrayIncluding([1, 2, 3], 1)
    expect(result).toBeTruthy()
  })

  test('should return false if the array does not include the item', () => {
    const result = isArrayIncluding([1, 2, 3], 4)
    expect(result).toBeFalsy()
  })
}
