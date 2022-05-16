
export interface Sample {
  <T>(array: Array<T>, size: number): Array<T>
  <T>(array: Array<T>): T
}

/**
 * Sample elements from an array.
 * @param array
 * @param size
 */
export const sample: Sample = (array: any, size?: any): any => {
  if (size !== undefined) {
    // --- If size is invalid, fallback to random sample size.
    if (size <= 0) size = Math.ceil(Math.random() * array.length)

    // ---
    const arrayCopy = [...array]
    while (arrayCopy.length > size) {
      const index = Math.floor(Math.random() * arrayCopy.length)
      arrayCopy.splice(index, 1)
    }
    return arrayCopy
  }

  // --- Get item at random index.
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}
