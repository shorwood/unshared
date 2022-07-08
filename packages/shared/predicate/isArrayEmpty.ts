/**
 * Check if an array is empty
 * @param {any[]} array The array to check
 * @returns {boolean} `true` if the array is empty, `false` otherwise
 * @example
 * isArrayEmpty([]) // true
 * isArrayEmpty([1, 2, 3]) // false
 */
export const isArrayEmpty = (array: any[]): array is [] =>
  Array.isArray(array)
  && array.length === 0
