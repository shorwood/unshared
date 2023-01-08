/**
 * Check if an array is not empty
 * @param array The array to check
 * @return `true` if the array is not empty, `false` otherwise
 * @example
 * isArrayNotEmpty([]) // false
 * isArrayNotEmpty([1, 2, 3]) // true
 */
export const isArrayNotEmpty = (array: any[]): boolean =>
  Array.isArray(array)
  && array.length > 0
