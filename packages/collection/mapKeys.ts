import type { Collection, FromEntries, Get, IteratorFunction, IteratorPath, MaybeLiteral } from '@unshared/types'
import { get } from './get'
import { isIterable } from './isIterable'

type MappedKeysByPath<T, P extends string> =
  T extends readonly unknown[] ? FromEntries<{ [K in keyof T]: [Get<T[K], P>, T[K]] } & Array<[PropertyKey, unknown]>> extends infer U ? { -readonly [K in keyof U]: U[K] } : never
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
 *   john: { name: { first: 'John', last: 'Doe' } },
 *   jane: { name: { first: 'Jane', last: 'Doe' } },
 * }
 *
 * // Convert the keys to uppercase.
 * mapValues(collection, key => key.toUpperCase()) // => { JOHN: { ... }, JANE: { ... } }
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
