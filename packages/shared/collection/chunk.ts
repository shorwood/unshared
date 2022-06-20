import { Matrix } from '../types'

/**
 * Splits an array into smaller arrays of a specified size.
 * @param {Array<T>} array The array to split
 * @param {number} size The size of each resulting array
 * @returns {Matrix<T>} The resulting array of arrays
 */
export const chunk = <T>(array: Array<T>, size: number): Matrix<T> => {
  // --- Handle edge cases.
  if (size < 1) throw new Error('Array chunk size must be greater than 0')

  // --- Chunk array.
  const result = []
  for (let index = 0; index < array.length; index += size)
    result.push(array.slice(index, index + size))

  // --- Return result.
  return result
}
