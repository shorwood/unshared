import { Collection, IteratedFunction, Path, Get } from '@unshared/types'
import { get } from './get'

/**
 * Iterates over an object or array, returning a new array consisting of the results
 * of the callback function.
 *
 * @param collection The collection to iterate over.
 * @param iterator The callback function to invoke for each item in the collection.
 * @returns A new array consisting of the results of the callback function.
 * @example map([1, 2, 3], x => x * x) // => [1, 4, 9]
 */
export function map<T extends Collection, U>(collection: T, iterator: IteratedFunction<T, U>): U[]
/**
 * Iterates over an object or array, returning a new array consisting of the values
 * at the given path.
 *
 * @param collection The collection to iterate over.
 * @param path The path to the value to return.
 * @returns A new array consisting of the values at the given path.
 * @example
 * // Declare a collection.
 * const collection = {
 *   a: { name: { first: 'John', last: 'Doe' } },
 *   b: { name: { first: 'Jane', last: 'Doe' } },
 *   c: { name: { first: 'Jack', last: 'Doe' } },
 * }
 *
 * // Get the first name of each item in the collection.
 * map(collection, 'name.first') // => ['John', 'Jane', 'Jack']
 */
export function map<T extends object, K extends Path<T>>(collection: Collection<T>, path: K | string & {}): Array<Get<T, K>>
export function map(collection: Collection, iteratorOrPath?: IteratedFunction | string): any[] {
  // --- If iterator is a value, cast as nested getter function.
  const iterator = typeof iteratorOrPath === 'function'
    ? iteratorOrPath
    : (value: unknown) => get(value, iteratorOrPath!)

  // --- If the collection has an iterator method, use it.
  if (Symbol.iterator in collection)
    // @ts-expect-error: The collection has a Symbol iterator method.
    return Array.from(collection, iterator)

  // --- Otherwise, iterate over the entries' values.
  return Object
    .entries(collection)
    .map(([key, value]) => iterator(value, key, collection))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should map an array', () => {
    const result = map([1, 2, 3], x => x * x)
    expect(result).toEqual([1, 4, 9])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('should map an object', () => {
    const result = map({ a: 1, b: 2, c: 3 }, x => x * x)
    expect(result).toEqual([1, 4, 9])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('should map an array of objects by key', () => {
    const result = map([{ foo: 'bar' }, { foo: 'baz' }], 'foo')
    expect(result).toEqual(['bar', 'baz'])
    expectTypeOf(result).toEqualTypeOf<string[]>()
  })

  it('should map an array of objects by path', () => {
    const result = map([{ foo: { bar: 'baz' } }, { foo: { bar: 'qux' } }], 'foo.bar')
    expect(result).toEqual(['baz', 'qux'])
    expectTypeOf(result).toEqualTypeOf<string[]>()
  })

  it('should map an object of objects by key', () => {
    const result = map({ a: { foo: 'bar' }, b: { foo: 'baz' } }, 'foo')
    expect(result).toEqual(['bar', 'baz'])
    expectTypeOf(result).toEqualTypeOf<string[]>()
  })

  it('should map an object that has a Symbol.iterator method', () => {
    const value = new Set([1, 2, 3])
    const result = map(value, x => x * x)
    expect(result).toEqual([1, 4, 9])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })
}
