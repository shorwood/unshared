import { Collection, IteratedFunction, Path, Value, Values } from '@unshared/types'
import { get } from './get'

interface Map {
  <T, K extends Path<T>>(object: Collection<T>, path: K): Array<Value<T, K>>
  <T, R>(collection: T, iterator: IteratedFunction<T, R>): Array<R>
  <T>(collection: T): Array<Values<T>>
}

/**
 * Iterates over an object or array, returning a new array
 * consisting of the results of the callback function or path.
 *
 * If path is supplied, it will be used to iterate over the object or array.
 *
 * If a callback is supplied, it will be invoked for each item in the object or array.
 * The callback can return a new value to be added to the new object or array.
 *
 * @param collection The object or array to iterate over
 * @param iterator The callback function or path to iterate over
 * @returns A new array consisting of the results of the callback function
 */
export const map: Map = (collection: any, iterator?: any): any => {
  if (iterator === undefined) {
    return Array.isArray(collection)
      ? collection
      : Object.values(collection)
  }

  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Map values.
  return Array.isArray(collection)
    ? collection.map(iterator)
    : Object.entries(collection).map(([key, value]) => iterator(value, key, collection))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('iterates over an array, returning a new array consisting of the results of the callback function', () => {
    expect(map([1, 2, 3], x => x)).toEqual([1, 2, 3])
    expect(map([1, 2, 3], x => x * x)).toEqual([1, 4, 9])
    expect(map([1, 2, 3], x => x + 1)).toEqual([2, 3, 4])
    expect(map([1, 2, 3], (x, index) => x + index)).toEqual([1, 3, 5])
  })

  it('iterates over an object, returning a new array consisting of the results of the callback function', () => {
    expect(map({ a: 1, b: 2, c: 3 }, x => x)).toEqual([1, 2, 3])
    expect(map({ a: 1, b: 2, c: 3 }, x => x * x)).toEqual([1, 4, 9])
    expect(map({ a: 1, b: 2, c: 3 }, (x, k) => x + k)).toEqual(['1a', '2b', '3c'])
    expect(map('abc', x => x.charCodeAt(0))).toEqual([97, 98, 99])
    expect(map('abc', (_x, _k, o) => o)).toEqual(['abc', 'abc', 'abc'])
  })

  it('iterates over an array, returning a new array consisting of the results of the path', () => {
    const object1 = { foo: 'foo', bar: undefined }
    const object2 = { foo: object1, bar: object1 }
    expect(map([object2, object2, object2], 'foo.foo')).toEqual(['foo', 'foo', 'foo'])
    expect(map({ a: object2, b: object2, c: object2 }, 'foo.bar')).toEqual([undefined, undefined, undefined])
  })

  it('returns input values if no secondary parameter was provided', () => {
    expect(map([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
    expect(map({ a: 1, b: 2, c: 3 })).toEqual([1, 2, 3])
  })
}
