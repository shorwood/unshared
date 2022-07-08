/**
 * Check if an array includes item
 * @param {any[]} array The array to check
 * @param {any} item The array to look for
 * @returns {boolean} `true` if the array includes item, `false` otherwise
 * @example
 * isArrayIncluding([], 1) // false
 * isArrayIncluding([1, 2, 3], 1) // true
 */
export const isArrayIncluding = <T>(array: T[], item: T): boolean =>
  Array.isArray(array)
  && array.includes(item)
