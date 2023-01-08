/**
 * Check if an array does not include all of the items
 * @param array The array to check
 * @param items The values to look for
 * @return `true` if the array does not include all of the items, `false` otherwise
 * @example
 * isArrayNotIncludingEvery([], []) // true
 * isArrayNotIncludingEvery([1, 2, 3], [1, 2, 3]) // false
 * isArrayNotIncludingEvery([1, 2, 3], [1, 2, 3, 4]) // true
 * isArrayNotIncludingEvery([1, 2, 3], []) // true
 */
export const isArrayNotIncludingEvery = <T>(array: T[], items: T[]): boolean =>
  Array.isArray(array)
  && Array.isArray(items)
  && items.every(item => !array.includes(item))
