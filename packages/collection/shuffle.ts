/**
 * Shuffle an array randomly or with a seed.
 *
 * @param array An array
 * @param seed A seed value
 * @returns A new shuffled array
 */
export const shuffle = <T>(array: Array<T>, seed: number = Math.random()): Array<T> => {
  const newArray = [...array]
  let currentIndex = array.length
  let valueBuffer
  let randomIndex

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
    expect(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.5)).toEqual([9, 1, 7, 2, 6, 3, 8, 4, 10, 5])
  })

  it('shuffles an empty array', () => {
    expect(shuffle([])).toEqual([])
  })

  it('shuffles an empty array with a single item', () => {
    expect(shuffle([1])).toEqual([1])
  })
}
