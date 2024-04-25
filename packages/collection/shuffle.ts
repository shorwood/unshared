/**
 * Shuffles an array using the [Fisher-Yates algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).
 * The original array is not modified and a new shuffled array is returned.
 *
 * @param array The array to shuffle.
 * @returns A new array with the elements shuffled.
 * @example shuffle([1, 2, 3, 4]) // => [3, 1, 4, 2]
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  let currentIndex = array.length
  let buffer

  // --- While there remain elements to shuffle
  while (currentIndex-- !== 0) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1))

    // --- Swap it with the current element.
    buffer = result[currentIndex]
    result[currentIndex] = result[randomIndex]
    result[randomIndex] = buffer
  }

  // --- Return the new array.
  return result
}

/* v8 ignore next */
if (import.meta.vitest) {
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
}
