import { Collection, NumberIntegerPositive, Tuple } from '@unshared/types'

/**
 * Returns a single item randomly sampled from a collection.
 *
 * @param collection The collection to sample from
 * @returns A random item from the array
 * @example
 * // Create a collection.
 * const collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 * // Sample a random item from the collection.
 * sample(collection) // => 3
 */
export function sample<T>(collection: Collection<T>): T

/**
 * Returns a single item randomly sampled from a collection.
 *
 * @param collection The collection to sample from
 * @param size The number of items to select, if the size is 1, the output will be a single item.
 * @returns A random item from the array
 * // Create a collection.
 * const collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 * // Sample a random item from the collection.
 * sample(collection, 1) // => 3
 */
export function sample<T>(collection: Collection<T>, size: 1): T

/**
 * Returns a sample array of random items selected from a collection.
 *
 * @param collection The collection to sample from
 * @param size The number of items to sample
 * @returns An array of random items from the collection
 * @example
 * // Create a collection.
 * const collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 * // Sample 3 random items from the collection.
 * sample(collection, 3) // => [3, 7, 1]
 */
export function sample<T, N extends number = number>(collection: Collection<T>, size: NumberIntegerPositive<N>): Tuple<N, T>
export function sample(object: Collection, size = 1) {
  if (typeof size === 'number' && size < 1)
    throw new RangeError('The sample size must be a positive number.')

  // --- Pick random items from the cloned collection.
  const copy = Object.values(object)
  const result = Array.from({ length: size })
  for (let i = 0; i < size; i++) {
    const seed = Math.random()
    const index = Math.floor(seed * copy.length)
    result[i] = copy[index]
    copy.splice(index, 1)
  }

  // --- Return a single item or an array of items.
  return size === 1 ? result[0] : result
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should samples a single item from an array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array)
    expect(array).not.toBe(result)
    expect(array).toContain(result)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  test('should samples a single item from an object', () => {
    const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    const objectValues = Object.values(object)
    const result = sample(object)
    expect(object).not.toBe(result)
    expect(objectValues).toContain(result)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  test('should samples an array of random items from an array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array, 3)
    expect(array).not.toBe(result)
    expect(result).lengthOf(3)
    expect(array).toContain(result[0])
    expect(array).toContain(result[1])
    expect(array).toContain(result[2])
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>()
  })

  test('should samples an array of random items from an object', () => {
    const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    const objectValues = Object.values(object)
    const result = sample(object, 3)
    expect(object).not.toBe(result)
    expect(result).lengthOf(3)
    expect(objectValues).toContain(result[0])
    expect(objectValues).toContain(result[1])
    expect(objectValues).toContain(result[2])
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>()
  })

  test('should throw an error if the chunk size is less than 1', () => {

    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => sample([1, 2, 3], 0)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should return undefined when sampling a single element from an empty array', () => {
    const result = sample([])
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<never>()
  })

  test('should return undefined when sampling a single element from an empty object', () => {
    const result = sample({})
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  test('should return a copy of the array when the sample size is the same as the array length', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array, array.length)
    const sorted = [...array].sort((a, b) => a - b)
    expect(array).not.toBe(result)
    expect(result).lengthOf(10)
    expect(sorted).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })
}
