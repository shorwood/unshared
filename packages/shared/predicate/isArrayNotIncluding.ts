/**
 * Check if an array does not include item
 * @param {any[]} array The array to check
 * @param {any} item The array to look for
 * @returns {boolean} `true` if the array does not include item, `false` otherwise
 * @example
 * isArrayNotIncluding([], 1) // true
 * isArrayNotIncluding([1, 2, 3], 1) // false
 */
export const isArrayNotIncluding = <T>(array: T[], item: T): boolean =>
  Array.isArray(array)
  && !array.includes(item)
