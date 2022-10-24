/**
 * Shuffle an array randomly or with a seed.
 * @param array An array
 * @param seed A seed value
 * @return A new shuffled array
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
