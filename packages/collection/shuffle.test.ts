import { shuffle } from './shuffle'

describe('shuffle', () => {
  test('should shuffle an array', () => {
    const array = Array.from({ length: 100 }, (_, index) => index)
    const result = shuffle(array)
    expect(result).toHaveLength(100)
    for (let index = 0; index < 100; index++)
      expect(result).toContain(index)
  })

  test('should not modify the original array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = shuffle(array)
    expect(result).not.toBe(array)
    expect(array).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  test('should contain the same elements', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = shuffle(array)
    expect(result).toHaveLength(10)
    for (let index = 1; index <= 10; index++)
      expect(result).toContain(index)
  })

  test('should shuffle an empty array', () => {
    const result = shuffle([])
    expect(result).toStrictEqual([])
  })

  test('should shuffle an empty array with a single item', () => {
    const result = shuffle([1])
    expect(result).toStrictEqual([1])
  })
})
