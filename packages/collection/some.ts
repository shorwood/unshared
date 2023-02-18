import { Collection, IteratedFunction } from '@unshared/types'

interface Some {
  <T>(array: Collection<T>, iterator: IteratedFunction<T, boolean>): boolean
  <T>(array: Collection<T>, value: T): boolean
}

/**
 * Checks if some object or array values predicates a function
 *
 * @param object The object or array to check
 * @param iterator A function that returns true if the value should be included
 * @returns True if there is at least one value, false otherwise
 */
export const some: Some = (object: any, iterator: any): boolean => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const value = iterator
    iterator = (v: any) => v === value
  }

  // --- Some values.
  return Array.isArray(object)
    ? object.some(iterator)
    : Object.entries(object).some(([key, value]) => iterator(value, key, object))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should work on arrays', () => {
    expect(some([1, 2, 3, 4], value => value < 10)).toEqual(true)
    expect(some([1, 2, 3, 4], value => value % 2 === 0)).toEqual(true)
    expect(some([1, 2, 3, 4], 1)).toEqual(true)
    expect(some([2, 2, 2, 2], 1)).toEqual(false)
  })

  it('should work on objects', () => {
    expect(some({ a: 1, b: 2, c: 3, d: 4 }, value => value < 10)).toEqual(true)
    expect(some({ a: 1, b: 2, c: 3, d: 4 }, value => value % 2 === 0)).toEqual(true)
    expect(some({ a: { b: 1 }, c: { b: 2 } }, value => 'b' in value)).toEqual(true)
  })

  it('should return false if object is empty', () => {
    expect(some({}, () => {})).toEqual(false)
    expect(some([], () => {})).toEqual(false)
  })
}
