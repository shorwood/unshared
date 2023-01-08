/**
 * Returns a new array with only unique values from the given array.
 * @param array The array to get unique values from
 * @return A new array with unique values
 */
export const uniq = <T>(array: Array<T>): Array<T> => [...new Set(array)]
