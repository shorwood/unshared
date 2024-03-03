import { Collection, IteratorFunction, IteratorPath, Get, FromEntries, MaybeLiteral } from '@unshared/types'
import { get } from './get'
import { isIterable } from './isIterable'

type MappedKeysByPath<T, P extends string> =
  T extends readonly unknown[] ? FromEntries<Array<[PropertyKey, unknown]> & { [K in keyof T]: [Get<T[K], P>, T[K]] }> extends infer U ? { -readonly [K in keyof U]: U[K] } : never
    : T extends Iterable<infer U> ? { [K in keyof T as Get<U, P> & PropertyKey]: U }
      : { -readonly [K in keyof T as Get<T[K], P> & PropertyKey]: T[K] }

type MappedKeysByIterator<T, R extends PropertyKey> =
  T extends ReadonlyArray<infer U> ? { -readonly [K in keyof T as R]: U }
    : T extends Iterable<infer U> ? { [K in keyof T as R]: U }
      : { [K in keyof T as R]: T[K] } extends infer U ? { -readonly [K in keyof U]: U[K] } : never

/**
 * Iterates over an object or array and returns a new object consisting of the values
 * at the given path. The path is a string of dot-separated keys.
 *
 * @param collection The collection to iterate over.
 * @param path The path to the value to return.
 * @returns A new object consisting of the values at the given path.
 * @example
 * // Declare a collection.
 * const collection = {
 *   a: { name: { first: 'John', last: 'Doe' } },
 *   b: { name: { first: 'Jane', last: 'Doe' } },
 *   c: { name: { first: 'Jack', last: 'Doe' } },
 * }
 *
 * // Get the first name of each item in the collection.
 * mapValues(collection, 'name.first') // => { a: 'John', b: 'Jane', c: 'Jack' }
 */
export function mapKeys<T, P extends IteratorPath<T>>(collection: T, path: MaybeLiteral<P>): MappedKeysByPath<T, P>
/**
 * Iterates over an object or array and transforms the keys using a callback function.
 *
 * @param collection The collection to iterate over.
 * @param iterator The callback function to invoke for each item in the collection.
 * @returns A new object consisting of the transformed keys.
 * @example
 * // Declare a collection.
 * const collection = {
 *   a: { name: { first: 'John', last: 'Doe' } },
 *   b: { name: { first: 'Jane', last: 'Doe' } },
 *   c: { name: { first: 'Jack', last: 'Doe' } },
 * }
 *
 * // Get the first name of each item in the collection.
 * mapValues(collection, (value) => value.name.first.toUpperCase()) // => { a: 'JOHN', b: 'JANE', c: 'JACK' }
 */
export function mapKeys<T, R extends PropertyKey>(collection: T, iterator: IteratorFunction<T, R>): MappedKeysByIterator<T, R>
export function mapKeys(collection: Collection, iteratorOrPath: IteratorFunction<unknown, PropertyKey> | string) {
  // --- If iterator is a string, cast as nested getter function.
  const iterator = typeof iteratorOrPath === 'function'
    ? iteratorOrPath
    : (item: unknown) => {
      const value = get(item, iteratorOrPath)
      if (typeof value === 'number') return value
      if (typeof value === 'symbol') return value
      if (typeof value === 'string') return value
      return String(value)
    }

  // --- If the collection has an iterator method, use it.
  if (isIterable(collection)) {
    const entries = [...collection].map((value, key) => [iterator(value, key, collection), value] as const)
    return Object.fromEntries(entries)
  }

  // --- Otherwise, iterate over the entries' values.
  const entries = Object
    .entries(collection)
    .map(([key, value]) => [iterator(value, key, collection), value] as const)

  // --- Return the entries as an object.
  return Object.fromEntries(entries)
}

/** v8 ignore start */
if (import.meta.vitest) {
  describe('path', () => {
    it('should map the keys of an object using a path', () => {
      const object = {
        foo: { bar: { baz: 'FOO' } },
        bar: { bar: { baz: 'BAR' } },
      } as const
      const result = mapKeys(object, 'bar.baz')
      expect(result).toEqual({
        FOO: { bar: { baz: 'FOO' } },
        BAR: { bar: { baz: 'BAR' } },
      })
      expectTypeOf(result).toEqualTypeOf<{
        FOO: { readonly bar: { readonly baz: 'FOO' } }
        BAR: { readonly bar: { readonly baz: 'BAR' } }
      }>()
    })

    it('should map the keys of an array using a path', () => {
      const array = [
        { bar: { baz: 'FOO' } },
        { bar: { baz: 'BAR' } },
      ] as const
      const result = mapKeys(array, 'bar.baz')
      expect(result).toEqual({
        FOO: { bar: { baz: 'FOO' } },
        BAR: { bar: { baz: 'BAR' } },
      })
      expectTypeOf(result).toEqualTypeOf<{
        FOO: { readonly bar: { readonly baz: 'FOO' } }
        BAR: { readonly bar: { readonly baz: 'BAR' } }
      }>()
    })

    it('should map the keys of a Set using a path', () => {
      const set = new Set([{ foo: 'BAR' }, { foo: 'BAZ' }] as const)
      const result = mapKeys(set, 'foo')
      expect(result).toEqual({ BAR: { foo: 'BAR' }, BAZ: { foo: 'BAZ' } })
      expectTypeOf(result).toEqualTypeOf<{
        BAR: { readonly foo: 'BAR' } | { readonly foo: 'BAZ' }
        BAZ: { readonly foo: 'BAR' } | { readonly foo: 'BAZ' }
      }>()
    })

    it('should map the keys of a Map using a path', () => {
      const map = new Map([['a', { foo: 'BAR' }], ['b', { foo: 'BAZ' }]] as const)
      const result = mapKeys(map, '1.foo')
      expect(result).toEqual({
        BAR: ['a', { foo: 'BAR' }],
        BAZ: ['b', { foo: 'BAZ' }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        BAR: ['a' | 'b', { readonly foo: 'BAR' } | { readonly foo: 'BAZ' }]
        BAZ: ['a' | 'b', { readonly foo: 'BAR' } | { readonly foo: 'BAZ' }]
      }>()
    })
  })

  describe('iterator', () => {
    it('should map the keys of an object using an iterator', () => {
      const object = { a: 'foo', b: 'bar', c: 'baz' } as const
      const callback = vi.fn((v: string) => v.toUpperCase()) as <T extends string>(value: T) => Uppercase<T>
      const result = mapKeys(object, callback)
      expect(result).toEqual({ FOO: 'foo', BAR: 'bar', BAZ: 'baz' })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith('foo', 'a', object)
      expect(callback).toHaveBeenCalledWith('bar', 'b', object)
      expect(callback).toHaveBeenCalledWith('baz', 'c', object)
      expectTypeOf(result).toEqualTypeOf<{
        FOO: 'bar' | 'baz' | 'foo'
        BAR: 'bar' | 'baz' | 'foo'
        BAZ: 'bar' | 'baz' | 'foo'
      }>()
    })

    it('should map the keys of an array using an iterator', () => {
      const array = ['foo', 'bar', 'baz'] as const
      const callback = vi.fn((v: string) => v.toUpperCase()) as <T extends string>(value: T) => Uppercase<T>
      const result = mapKeys(array, callback)
      expect(result).toEqual({ FOO: 'foo', BAR: 'bar', BAZ: 'baz' })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith('foo', 0, array)
      expect(callback).toHaveBeenCalledWith('bar', 1, array)
      expect(callback).toHaveBeenCalledWith('baz', 2, array)
      expectTypeOf(result).toEqualTypeOf<{
        FOO: 'bar' | 'baz' | 'foo'
        BAR: 'bar' | 'baz' | 'foo'
        BAZ: 'bar' | 'baz' | 'foo'
      }>()
    })

    it('should map the keys of a Set using an iterator', () => {
      const set = new Set(['foo', 'bar', 'baz'] as const)
      const callback = vi.fn((v: string) => v.toUpperCase()) as <T extends string>(value: T) => Uppercase<T>
      const result = mapKeys(set, callback)
      expect(result).toEqual({ FOO: 'foo', BAR: 'bar', BAZ: 'baz' })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith('foo', 0, set)
      expect(callback).toHaveBeenCalledWith('bar', 1, set)
      expect(callback).toHaveBeenCalledWith('baz', 2, set)
      expectTypeOf(result).toEqualTypeOf<{
        FOO: 'bar' | 'baz' | 'foo'
        BAR: 'bar' | 'baz' | 'foo'
        BAZ: 'bar' | 'baz' | 'foo'
      }>()
    })

    it('should map the keys of a Map using an iterator', () => {
      const map = new Map([['a', 'foo'], ['b', 'bar'], ['c', 'baz']] as const)
      const callback = vi.fn((v: [string, string]) => v[1].toUpperCase()) as <T extends string>(value: [string, T]) => Uppercase<T>
      const result = mapKeys(map, callback)
      expect(result).toEqual({ FOO: ['a', 'foo'], BAR: ['b', 'bar'], BAZ: ['c', 'baz'] })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(['a', 'foo'], 0, map)
      expect(callback).toHaveBeenCalledWith(['b', 'bar'], 1, map)
      expect(callback).toHaveBeenCalledWith(['c', 'baz'], 2, map)
      expectTypeOf(result).toEqualTypeOf<{
        FOO: ['a' | 'b' | 'c', 'bar' | 'baz' | 'foo']
        BAR: ['a' | 'b' | 'c', 'bar' | 'baz' | 'foo']
        BAZ: ['a' | 'b' | 'c', 'bar' | 'baz' | 'foo']
      }>()
    })
  })
}
