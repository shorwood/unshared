interface Sample {
  <T>(array: Array<T>, size: number): Array<T>
  <T>(array: Array<T>): T
}

/**
 * Returns a random item from an array, or an array of random items if a size is specified.
 * @param {Array} array The array to select from
 * @param {number} [size] The number of items to select
 * @returns {any} A random item from the array
 */
export const sample: Sample = (array: any, size?: any): any => {
  if (size !== undefined) {
    // --- If size is invalid, fallback to random sample size.
    if (size <= 0) size = Math.ceil(Math.random() * array.length)
    if (size >= array.length) return [...array]

    // --- Move items to copy until we have the requested size.
    const arrayCopy = [...array]
    const arrayResult = []
    while (arrayResult.length < size) {
      const index = Math.floor(Math.random() * arrayCopy.length)
      arrayResult.push(arrayCopy.splice(index, 1))
    }
    return arrayResult
  }

  // --- Get item at random index.
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}
