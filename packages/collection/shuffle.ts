/**
 * Shuffles an array using the [Fisher-Yates algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).
 * The original array is not modified and a new shuffled array is returned.
 *
 * @param array The array to shuffle.
 * @param seed The seed to use for the shuffle.
 * @returns The shuffled array.
 * @example shuffle([1, 2, 3, 4]) // => [3, 1, 4, 2]
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array]
  let currentIndex = array.length
  let valueBuffer

  // --- While there remain elements to shuffle
  while (currentIndex-- !== 0) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1))

    // --- Swap it with the current element.
    valueBuffer = newArray[currentIndex]
    newArray[currentIndex] = newArray[randomIndex]
    newArray[randomIndex] = valueBuffer
  }

  // --- Return the new array.
  return newArray
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should shuffle an array without a seed', () => {
    const array = Array.from({ length: 100 }, (_, index) => index)
    const result = shuffle(array)
    expect(result).not.toEqual(array)
    expect(result).toHaveLength(100)
    for (let index = 0; index < 100; index++)
      expect(result).toContain(index)
  })

  it('should shuffle an empty array', () => {
    const result = shuffle([])
    expect(result).toEqual([])
  })

  it('should shuffle an empty array with a single item', () => {
    const result = shuffle([1])
    expect(result).toEqual([1])
  })
}
