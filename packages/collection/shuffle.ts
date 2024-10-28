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
    // eslint-disable-next-line sonarjs/pseudo-random
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1))

    // --- Swap it with the current element.
    buffer = result[currentIndex]
    result[currentIndex] = result[randomIndex]
    result[randomIndex] = buffer
  }

  // --- Return the new array.
  return result
}
