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

/* v8 ignore next */
if (import.meta.vitest) {
  test('should chunk an array into smaller arrays of a specified size', () => {
    const result = chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3)
    expect(result).toStrictEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
    expectTypeOf(result).toEqualTypeOf<number[][]>()
  })

  test('should chunk even if the array size is smaller than the chunk size', () => {
    const result = chunk([1, 2, 3], 4)
    expect(result).toStrictEqual([[1, 2, 3]])
    expectTypeOf(result).toEqualTypeOf<number[][]>()
  })

  test('should not chunk empty arrays', () => {
    const result = chunk([], 10)
    expect(result).toStrictEqual([])
    expectTypeOf(result).toEqualTypeOf<never[][]>()
  })
}
