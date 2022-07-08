/**
 * Check if an array does not include all of the items
 * @param {any[]} array The array to check
 * @param {any[]} items The values to look for
 * @returns {boolean} `true` if the array does not include all of the items, `false` otherwise
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
