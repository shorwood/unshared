interface Sample {
  <T>(array: Array<T>, size: number): Array<T>
  <T>(array: Array<T>): T
}

/**
 * Returns a random item from an array, or an array of random items if a size is specified.
 *
 * @param array The array to select from
 * @param size The number of items to select
 * @param seed A seed number for predictable results
 * @returns A random item from the array
 */
export const sample: Sample = (array: any[], size?: number, seed: number = Math.random()): any => {
  // --- Handle edge cases.
  if (typeof size === 'number' && size < 1) throw new Error('Array chunk size must be greater than 0')

  // --- Get item at random index.
  if (size === undefined) {
    return array.length <= 1
      ? array[0]
      : array[Math.floor(seed * array.length)]
  }

  //  --- If sample size larger than array size, return copy of array.
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

/* c8 ignore next */
if (import.meta.vitest) {
  it('samples a random item from an array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array)
    expect(array).toContain(result)
  })

  it('samples an array of random items from an array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array, 3)
    expect(result.length).toEqual(3)
    expect(array).toContain(result[0])
    expect(array).toContain(result[1])
    expect(array).toContain(result[2])
  })

  it('should throw an error if the chunk size is less than 1', () => {
    expect(() => sample([1, 2, 3, 4, 5], 0)).toThrowError()
    expect(() => sample([1, 2, 3, 4, 5], -1)).toThrowError()
  })

  it('should return undefined when sampling a single element from an empty array', () => {
    expect(sample([])).toBeUndefined()
  })

  it('should return a copy of the array when the sample size is the same as the array length', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    expect(sample(array, array.length)).toEqual(array)
  })
}
