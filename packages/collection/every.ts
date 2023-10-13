import { Collection, IteratedFunction, Values } from '@unshared/types'

/**
 * Checks if every value passes the given test. If the iterator is a
 * value, it will be compared to each value in the collection.
 *
 * @param collection The collection to iterate over.
 * @param iterator The iterator function or value to compare.
 * @returns `true` if every value passes the test, otherwise `false`.
 * @example every([1, 2, 3, 4], value => value < 10) // => true
 */
export function every<T extends Collection>(collection: T, iterator: IteratedFunction<T, boolean>): boolean
/**
 * Checks if every value is equal to the given value. If the iterator is a
 * value, it will be compared to each value in the collection.
 *
 * @param collection The collection to iterate over.
 * @param value The value to compare to each value in the collection.
 * @returns `true` if every value passes the test, otherwise `false`.
 * @example every([1, 2, 3, 4], 1) // => true
 */
export function every<T extends Collection>(collection: T, value: Values<T>): boolean
export function every(collection: Collection, iteratorOrValue: unknown): boolean {
  // --- If iterator is a value, cast as iterator function.
  const iterator = typeof iteratorOrValue === 'function'
    ? iteratorOrValue
    : (value: unknown) => value === iteratorOrValue

  // --- Check if every value passes the test.
  return Object
    .entries(collection)
    .every(([key, value]) => iterator(value, key, collection))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true if every value of an array passes the test', () => {
    const result = every([1, 10, 20, 30], value => value > 0)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false if not every value of an array passes the test', () => {
    const result = every([1, 10, 20, 30], value => value < 10)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return true if every value of an array equals the value', () => {
    const result = every([1, 1, 1, 1], 1)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false if not every value of an array equal the value', () => {
    const result = every([1, 1, 1, 5], 1)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return true if every value of an object passes the test', () => {
    const result = every({ a: 1, b: 10, c: 20, d: 30 }, value => value > 0)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false if not every value of an object pass the test', () => {
    const result = every({ a: 1, b: 10, c: 20, d: 30 }, value => value < 10)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return true if every value of an object equals the value', () => {
    const result = every({ a: 1, b: 1, c: 1, d: 1 }, 1)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false if not every value of an object equal the value', () => {
    const result = every({ a: 1, b: 1, c: 1, d: 5 }, 1)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return true for empty arrays', () => {
    const result = every([], () => true)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return true for empty objects', () => {
    const result = every({}, () => true)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
