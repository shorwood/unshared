import { chunk } from './chunk'

describe('chunk', () => {
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
})
