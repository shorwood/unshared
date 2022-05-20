import { Matrix } from '../types'

/**
 * Splits an array into smaller arrays of a specified size.
 * @param {Array<T>} array The array to split
 * @param {number} size The size of each resulting array
 * @returns {Matrix<T>} The resulting array of arrays
 */
export const chunk = <T>(array: Array<T>, size: number): Matrix<T> => {
  const result = []
  let index = 0
  while (index < array.length) {
    result.push(array.slice(index, index + size))
    index = index + size
  }
  return result
}
