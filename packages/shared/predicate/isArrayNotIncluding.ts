/**
 * Check if an array does not include item
 * @param array The array to check
 * @param item The array to look for
 * @return `true` if the array does not include item, `false` otherwise
 * @example
 * isArrayNotIncluding([], 1) // true
 * isArrayNotIncluding([1, 2, 3], 1) // false
 */
export const isArrayNotIncluding = <T>(array: T[], item: T): boolean =>
  Array.isArray(array)
  && !array.includes(item)
