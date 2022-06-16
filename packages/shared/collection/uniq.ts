/**
 * Returns a new array with only unique values from the given array.
 * @param {Array<T>} array The array to get unique values from
 * @returns {Array<T>} A new array with unique values
 */
export const uniq = <T>(array: Array<T>): Array<T> => [...new Set(array)]
