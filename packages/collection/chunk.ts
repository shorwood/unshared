import { Vector } from '@unshared-dev/types'

/**
 * Splits an array into smaller arrays of a specified size.
 * @param array The array to split
 * @param size The size of each resulting array
 * @return The resulting array of arrays
 */
export const chunk = <T>(array: Array<T>, size: number): Vector<T> => {
  // --- Handle edge cases.
  if (size < 1) throw new Error('Array chunk size must be greater than 0')

  // --- Chunk array.
  const result = []
  for (let index = 0; index < array.length; index += size)
    result.push(array.slice(index, index + size))

  // --- Return result.
  return result
}
