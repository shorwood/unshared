import { Collection, NumberIntegerPositive, Tuple } from '@unshared/types'

/**
 * Returns a random item from an array, or an array of random items if a size is specified.
 *
 * @param object The array to select from
 * @param size The number of items to select
 * @returns A random item from the array
 */
export function sample<T>(object: Collection<T>, size: 1): T
/**
 * Returns a random item from an array, or an array of random items if a size is specified.
 *
 * @param object The array to select from
 * @returns A random item from the array
 */
export function sample<T>(object: Collection<T>): T
/**
 * Returns a random item from an array, or an array of random items if a size is specified.
 *
 * @param object The array to select from
 * @param size The number of items to select
 * @returns A random item from the array
 */
export function sample<T, N extends number = number>(object: Collection<T>, size: NumberIntegerPositive<N>): Tuple<N, T>
export function sample(object: Collection, size = 1) {
  if (typeof size === 'number' && size < 1)
    throw new RangeError('The sample size must be a positive number.')

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

/* c8 ignore next */
if (import.meta.vitest) {
  it('should samples a single item from an array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array)
    expect(array).not.toBe(result)
    expect(array).toContain(result)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it('should samples a single item from an object', () => {
    const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    const objectValues = Object.values(object)
    const result = sample(object)
    expect(object).not.toBe(result)
    expect(objectValues).toContain(result)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it('should samples an array of random items from an array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array, 3)
    expect(array).not.toBe(result)
    expect(result).lengthOf(3)
    expect(array).toContain(result[0])
    expect(array).toContain(result[1])
    expect(array).toContain(result[2])
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>()
  })

  it('should samples an array of random items from an object', () => {
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

  it('should throw an error if the chunk size is less than 1', () => {
    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => sample([1, 2, 3], 0)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should return undefined when sampling a single element from an empty array', () => {
    const result = sample([])
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<never>()
  })

  it('should return undefined when sampling a single element from an empty object', () => {
    const result = sample({})
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  it('should return a copy of the array when the sample size is the same as the array length', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array, array.length)
    expect(array).not.toBe(result)
    expect(result).lengthOf(10)
    expect(result).toContain(1)
    expect(result).toContain(2)
    expect(result).toContain(3)
    expect(result).toContain(4)
    expect(result).toContain(5)
    expect(result).toContain(6)
    expect(result).toContain(7)
    expect(result).toContain(8)
    expect(result).toContain(9)
    expect(result).toContain(10)
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })
}
