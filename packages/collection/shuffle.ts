/**
 * Shuffles an array using the [Fisher-Yates algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).
 * The original array is not modified and a new shuffled array is returned.
 *
 * @param array The array to shuffle.
 * @param seed The seed to use for the shuffle.
 * @returns The shuffled array.
 * @example shuffle([1, 2, 3, 4]) // => [3, 1, 4, 2]
 */
export function shuffle<T>(array: Array<T>, seed?: number): Array<T> {
  const newArray = [...array]
  let currentIndex = array.length
  let valueBuffer
  let randomIndex

  // --- Normalize the seed from 0 to 1.
  seed = seed === undefined
    ? Math.random()
    : Math.abs(Math.sin(seed))

  // --- While there remain elements to shuffle
  while (currentIndex-- !== 0) {
    // --- Pick a remaining element randomly.
    randomIndex = Math.floor(seed * currentIndex)

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
  it('shuffles an array with a seed', () => {
    const result = shuffle([1, 2, 3, 4], 0.5)
    const expected = [4, 3, 1, 2]
    expect(result).toEqual(expected)
  })

  it('shuffles an empty array', () => {
    const result = shuffle([])
    expect(result).toEqual([])
  })

  it('shuffles an empty array with a single item', () => {
    const result = shuffle([1])
    expect(result).toEqual([1])
  })
}
