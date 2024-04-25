import { Get, IteratorFunction, IteratorPath, Values } from '@unshared/types'
import { isIterable } from './isIterable'
import { get } from './get'

type MappedValuesByPath<T, P extends string> =
  T extends readonly unknown[] ? { -readonly [K in keyof T]: Get<T[K], P> }
    : T extends Iterable<unknown> ? Array<Get<Values<T>, P>>
      : { -readonly [K in keyof T]: Get<T[K], P> }

type MappedValuesByIterator<T, R> =
  T extends readonly unknown[] ? { -readonly [K in keyof T]: R }
    : T extends Iterable<unknown> ? R[]
      : { -readonly [K in keyof T]: R }

/**
 * Iterates over a object, returning a new object consisting of values
 * at the given path. If the object is an array, the results will be an array.
 * If the object is an object, the results will be an object.
 *
 * This function also supports iterables, such as Set and Map but will always return
 * an array of the results.
 *
 * @param collection The collection to iterate over.
 * @param path The path to the value to return.
 * @returns A new array consisting of the values at the given path.
 * @example
 * // Declare a object.
 * const object = {
 *   a: { name: { first: 'John', last: 'Doe' } },
 *   b: { name: { first: 'Jane', last: 'Doe' } },
 *   c: { name: { first: 'Jack', last: 'Doe' } },
 * }
 *
 * // Get the first name of each item in the object.
 * mapValues(object, 'name.first') // => ['John', 'Jane', 'Jack']
 */
export function mapValues<T, P extends string = string>(collection: T, path: IteratorPath<T> & P): MappedValuesByPath<T, P>
/**
 * Iterates over an object or array, returning a new array consisting of the results
 * of the callback function.
 *
 * @param collection The collection to iterate over.
 * @param iterator The callback function to invoke for each item in the object.
 * @returns A new array consisting of the results of the callback function.
 * @example map([1, 2, 3], x => x * x) // => [1, 4, 9]
 */
export function mapValues<T, R>(collection: T, iterator: IteratorFunction<T, R>): MappedValuesByIterator<T, R>
export function mapValues(collection: object, iteratorOrPath?: IteratorFunction | string) {

  // --- If iterator is a value, cast as nested getter function.
  const iterator = typeof iteratorOrPath === 'function'
    ? iteratorOrPath
    : (value: unknown) => get(value, iteratorOrPath!)

  // --- If the object has an iterator method, use it.
  if (isIterable(collection))
    return [...collection].map((value, key) => iterator(value, key, collection))

  // --- Otherwise, iterate over the entries' values.
  const entries = Object
    .entries(collection)
    .map(([key, value]) => [key, iterator(value, key, collection)] as const)
  return Object.fromEntries(entries)
}

/* v8 ignore next */
if (import.meta.vitest) {
  describe('path', () => {
    it('should map the values of an object by path', () => {
      const object = { a: { foo: { bar: 'baz' } }, b: { foo: { bar: 'qux' } } } as const
      const result = mapValues(object, 'foo.bar')
      expect(result).toStrictEqual({ a: 'baz', b: 'qux' })
      expectTypeOf(result).toEqualTypeOf<{ a: 'baz'; b: 'qux' }>()
    })

    it('should map the values of an array by path', () => {
      const array = [{ foo: { bar: 'baz' } }, { foo: { bar: 'qux' } }] as const
      const result = mapValues(array, 'foo.bar')
      expect(result).toStrictEqual(['baz', 'qux'])
      expectTypeOf(result).toEqualTypeOf<['baz', 'qux']>()
    })

    it('should map the values of a Set by path', () => {
      const set = new Set([{ foo: 'bar' }, { foo: 'baz' }])
      const result = mapValues(set, 'foo')
      expect(result).toStrictEqual(['bar', 'baz'])
      expectTypeOf(result).toEqualTypeOf<string[]>()
    })

    it('should map the values of a Map by path', () => {
      const map = new Map([['a', { foo: 'bar' }], ['b', { foo: 'baz' }]])
      const result = mapValues(map, '1.foo')
      expect(result).toStrictEqual(['bar', 'baz'])
      expectTypeOf(result).toEqualTypeOf<string[]>()
    })
  })

  describe('iterator', () => {
    it('should map the values of an object using a predicator function', () => {
      const object = { bar: 2, baz: 3, foo: 1 } as const
      const callback = vi.fn((v: number) => v.toString()) as <N extends number>(value: N) => `${N}`
      const result = mapValues({ bar: 2, baz: 3, foo: 1 } as const, callback)
      expect(result).toStrictEqual({ bar: '2', baz: '3', foo: '1' })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(1, 'foo', object)
      expect(callback).toHaveBeenCalledWith(2, 'bar', object)
      expect(callback).toHaveBeenCalledWith(3, 'baz', object)
      expectTypeOf(result).toEqualTypeOf<{
        bar: '1' | '2' | '3'
        baz: '1' | '2' | '3'
        foo: '1' | '2' | '3'
      }>()
    })

    it('should map the values of an array using a predicator function', () => {
      const array = [1, 2, 3] as const
      const callback = vi.fn((v: number) => v.toString()) as <N extends number>(value: N) => `${N}`
      const result = mapValues(array, callback)
      expect(result).toStrictEqual(['1', '2', '3'])
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(1, 0, array)
      expect(callback).toHaveBeenCalledWith(2, 1, array)
      expect(callback).toHaveBeenCalledWith(3, 2, array)
      expectTypeOf(result).toEqualTypeOf<[
        '1' | '2' | '3',
        '1' | '2' | '3',
        '1' | '2' | '3',
      ]>()
    })

    it('should map the values of a Set using a predicator function', () => {
      const set = new Set([1, 2, 3])
      const callback = vi.fn((v: number) => v.toString()) as <N extends number>(value: N) => `${N}`
      const result = mapValues(set, callback)
      expect(result).toStrictEqual(['1', '2', '3'])
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(1, 0, set)
      expect(callback).toHaveBeenCalledWith(2, 1, set)
      expect(callback).toHaveBeenCalledWith(3, 2, set)
      expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>()
    })

    it('should map the values of a Map using a predicator function', () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      const callback = vi.fn((v: [string, number]) => v[1].toString()) as <N extends number>(v: [string, N]) => `${N}`
      const result = mapValues(map, callback)
      expect(result).toStrictEqual(['1', '2', '3'])
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(['a', 1], 0, map)
      expect(callback).toHaveBeenCalledWith(['b', 2], 1, map)
      expect(callback).toHaveBeenCalledWith(['c', 3], 2, map)
      expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>()
    })
  })
}
