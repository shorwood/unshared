/**
 * Check if an array does not include some of the items
 * @param {any[]} array The array to check
 * @param {any[]} items The values to look for
 * @returns {boolean} `true` if the array does not include some of the items, `false` otherwise
 * @example
 * isArrayNotIncludingSome([], []) // false
 * isArrayNotIncludingSome([1, 2, 3], [1]) // false
 * isArrayNotIncludingSome([1, 2, 3], [1, 2, 3, 4]) // false
 * isArrayNotIncludingSome([1, 2, 3], [4]) // true
 */
export const isArrayNotIncludingSome = <T>(array: T[], items: T[]): boolean =>
  Array.isArray(array)
  && Array.isArray(items)
  && items.some(item => !array.includes(item))
