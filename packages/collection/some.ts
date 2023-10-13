import { Collection, IteratedFunction, Values } from '@unshared/types'

/**
 * Checks if at least one value passes the given test. If the iterator is a
 * value, it will be compared to each value in the collection.
 *
 * @param collection The collection to iterate over.
 * @param iterator The iterator function or value to compare.
 * @returns `true` if at least one value passes the test, otherwise `false`.
 * @example some([1, 2, 3, 4], value => value < 10) // => true
 */
export function some<T extends Collection>(collection: T, iterator: IteratedFunction<T, boolean>): boolean
/**
 * Checks if at least one value passes the given test. If the iterator is a
 * value, it will be compared to each value in the collection.
 *
 * @param collection The collection to iterate over.
 * @param value The value to compare to each value in the collection.
 * @returns `true` if at least one value passes the test, otherwise `false`.
 * @example some([1, 2, 3, 4], 1) // => true
 */
export function some<T extends Collection>(collection: T, value: Values<T>): boolean
export function some(collection: Collection, iteratorOrValue: unknown): boolean {
  // --- If iterator is a value, cast as iterator function.
  const iterator = typeof iteratorOrValue === 'function'
    ? iteratorOrValue
    : (value: unknown) => value === iteratorOrValue

  // --- Check if at least one value passes the test.
  return Object
    .entries(collection)
    .some(([key, value]) => iterator(value, key, collection))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true if at least one value of an array passes the test', () => {
    const result = some([1, 10, 20, 30], value => value > 10)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false if no values of an array pass the test', () => {
    const result = some([1, 10, 20, 30], value => value < 0)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return true if at least one value of an array equals the value', () => {
    const result = some([1, 10, 20, 30], 1)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false if no values of an array equal the value', () => {
    const result = some([1, 2, 3, 4], 5)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return true if at least one value of an object passes the test', () => {
    const result = some({ a: 1, b: 10, c: 20, d: 30 }, value => value > 10)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false if no values of an object pass the test', () => {
    const result = some({ a: 1, b: 10, c: 20, d: 30 }, value => value < 0)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return true if at least one value of an object equals the value', () => {
    const result = some({ a: 1, b: 2, c: 3, d: 4 }, 1)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false if no values of an object equal the value', () => {
    const result = some({ a: 1, b: 2, c: 3, d: 4 }, 5)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false for empty arrays', () => {
    const result = some([], () => true)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should return false for empty objects', () => {
    const result = some({}, () => true)
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
