/**
 * Check if an array includes some of the items
 * @param {any[]} array The array to check
 * @param {any[]} items The values to look for
 * @returns {boolean} `true` if the array includes some of the items, `false` otherwise
 * @example
 * isArrayIncludingSome([], []) // false
 * isArrayIncludingSome([1, 2, 3], [1]) // true
 * isArrayIncludingSome([1, 2, 3], [1, 2, 3, 4]) // true
 */
export const isArrayIncludingSome = <T>(array: T[], items: T[]): boolean =>
  Array.isArray(array)
  && Array.isArray(items)
  && items.some(item => array.includes(item))
