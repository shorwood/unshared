interface Sample {
  <T>(array: Array<T>, size: number): Array<T>
  <T>(array: Array<T>): T
}

/**
 * Returns a random item from an array, or an array of random items if a size is specified.
 * @param {Array<T>} array The array to select from
 * @param {number} [size] The number of items to select
 * @param {number} [seed] A seed number for predictable results
 * @returns {T | Array<T>} A random item from the array
 */
export const sample: Sample = (array: any[], size?: number, seed: number = Math.random()): any => {
  // --- Handle edge cases.
  if (array.length === 0) return []
  if (size && size < 1) throw new Error('Array chunk size must be greater than 0')

  // --- Get item at random index.
  if (size === undefined) {
    const index = Math.floor(seed * array.length)
    return array[index]
  }

  // --- If size is invalid, fallback to random sample size.
  if (size <= 0) size = Math.ceil(seed * array.length)
  if (size >= array.length) return [...array]

  // --- Move items to copy until we have the requested size.
  const arrayCopy = [...array]
  const arrayResult = []
  while (arrayResult.length < size) {
    const index = Math.floor(seed * arrayCopy.length)
    arrayResult.push(arrayCopy?.[index])
  }

  // --- Return results
  return arrayResult
}
