import type { NumberIntegerPositive } from '@unshared/types'

/**
 * Splits an array into smaller arrays of a specified size.
 *
 * @param array The array to split.
 * @param size The size of each chunk.
 * @returns An array of chunks of the original array.
 * @example chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T, N extends number>(array: T[], size: NumberIntegerPositive<N>): T[][] {
  const chunksLength = Math.ceil(array.length / size)
  const chunks = Array.from({ length: chunksLength })

  // --- Split the array into chunks.
  for (let index = 0; index < array.length; index += size) {
    const chunkIndex = Math.floor(index / size)
    chunks[chunkIndex] = array.slice(index, index + size)
  }

  // --- Return the chunks.
  return chunks as T[][]
}
