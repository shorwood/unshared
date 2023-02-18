import { Collection } from '@unshared/types/collection'
import { IteratedFunction } from '@unshared/types/IteratedFunction'

interface Every {
  <T, U>(array: T, iterator: IteratedFunction<T, U>): boolean
  <T>(array: Collection<T>, value: T): boolean
}

/**
 * Checks if every object or array values predicates a function
 *
 * @param object The object or array to check
 * @param iterator A function that returns true if the value should be included
 * @returns True if there is at least one value, false otherwise
 */
export const every: Every = (object: any, iterator: any): boolean => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const value = iterator
    iterator = (v: any) => v === value
  }

  // --- Every values.
  return Array.isArray(object)
    ? object.every(iterator)
    : Object.entries(object).every(([key, value]) => iterator(value, key, object))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should work on arrays', () => {
    expect(every([1, 2, 3, 4], value => value < 10)).toEqual(true)
    expect(every([1, 2, 3, 4], value => value % 2 === 0)).toEqual(false)
    expect(every([1, 1, 1, 1], 1)).toEqual(true)
    expect(every([1, 1, 1, 2], 1)).toEqual(false)
  })

  it('should work on objects', () => {
    expect(every({ a: 1, b: 2, c: 3, d: 4 }, value => value < 10)).toEqual(true)
    expect(every({ a: 1, b: 2, c: 3, d: 4 }, value => value % 2 === 0)).toEqual(false)
    expect(every({ a: { b: 1 }, c: { b: 2 } }, value => 'b' in value)).toEqual(true)
  })

  it('should return false if object is empty', () => {
    expect(every({}, () => {})).toEqual(true)
    expect(every([], () => {})).toEqual(true)
  })
}
