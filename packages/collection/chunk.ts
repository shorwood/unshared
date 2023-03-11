import { Vector } from '@unshared/types'
// TODO: Improve type inference for tuple types.

/**
 * Splits an array into smaller arrays of a specified size.
 *
 * @param array The array to split.
 * @param size The size of each chunk.
 * @returns An array of chunks of the original array.
 * @example chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: Array<T>, size: number): Vector<T> {
  // --- Handle edge cases.
  if (Array.isArray(array) === false)
    throw new TypeError('Array chunk input must be an array')
  if (typeof size !== 'number' || Number.isInteger(size) === false)
    throw new TypeError('Array chunk size must be an integer')
  if (size < 1)
    throw new RangeError('Array chunk size must be greater than 0')

  // --- Chunk array.
  const result = []
  for (let index = 0; index < array.length; index += size)
    result.push(array.slice(index, index + size))

  // --- Return result.
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should chunk an array into smaller arrays of a specified size', () => {
    const result = chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3)
    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
  })

  it('should chunk even if the array size is smaller than the chunk size', () => {
    const result = chunk([1, 2, 3], 4)
    expect(result).toEqual([[1, 2, 3]])
  })

  it('should not chunk empty arrays', () => {
    const result = chunk([], 10)
    expect(result).toEqual([])
  })

  it('should throw an error if the input is not an array', () => {
    const shouldThrow = () => chunk(1 as any, 3)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the size is not an integer', () => {
    const shouldThrow = () => chunk([1, 2, 3], 3.5)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the size is less than 1', () => {
    const shouldThrow = () => chunk([1, 2, 3], 0)
    expect(shouldThrow).toThrow(RangeError)
  })
}
