import type { NumberIntegerPositive } from '@unshared/types'

/**
 * Splits an array into smaller arrays of a specified size.
 *
 * @param array The array to split.
 * @param size The size of each chunk.
 * @returns An array of chunks of the original array.
 * @example chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T, N extends number>(array: Array<T>, size: NumberIntegerPositive<N>): Array<T>[] {
  const chunks = []
  for (let index = 0; index < array.length; index += size) {
    const chunk = array.slice(index, index + size)
    chunks.push(chunk)
  }
  return chunks
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should chunk an array into smaller arrays of a specified size', () => {
    const result = chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3)
    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
    expectTypeOf(result).toEqualTypeOf<number[][]>()
  })

  it('should chunk even if the array size is smaller than the chunk size', () => {
    const result = chunk([1, 2, 3], 4)
    expect(result).toEqual([[1, 2, 3]])
    expectTypeOf(result).toEqualTypeOf<number[][]>()
  })

  it('should not chunk empty arrays', () => {
    const result = chunk([], 10)
    expect(result).toEqual([])
    expectTypeOf(result).toEqualTypeOf<never[][]>()
  })
}
