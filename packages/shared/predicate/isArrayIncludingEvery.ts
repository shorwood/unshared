/**
 * Check if an array includes all of the items
 * @param {any[]} array The array to check
 * @param {any[]} items The values to look for
 * @returns {boolean} `true` if the array includes all of the items, `false` otherwise
 * @example
 * isArrayIncludingEvery([], []) // true
 * isArrayIncludingEvery([1, 2, 3], [1]) // true
 * isArrayIncludingEvery([1, 2, 3], [1, 2, 3, 4]) // false
 */
export const isArrayIncludingEvery = <T>(array: T[], items: T[]): boolean =>
  Array.isArray(array)
  && Array.isArray(items)
  && items.every(item => array.includes(item))
