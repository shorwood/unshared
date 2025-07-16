import type { Get, IteratorFunction, IteratorPath, Values } from '@unshared/types'
import { get } from './get'
import { isIterable } from './isIterable'

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

/**
 * Iterates over an object or array, returning a new object consisting of the results
 * of the callback function or the values at the given path.
 *
 * @param collection The collection to iterate over.
 * @param iteratorOrPath The callback function to invoke for each item in the object or a path to the value to return.
 * @returns A new object consisting of the results of the callback function or the values at the given path.
 * @example
 * // Declare a object.
 * const object = {
 *   a: { name: { first: 'John', last: 'Doe' } },
 *   b: { name: { first: 'Jane', last: 'Doe' } },
 *   c: { name: { first: 'Jack', last: 'Doe' } },
 * }
 *
 * // Get the first name of each item in the object.
 * mapValues(object, 'name.first') // => { a: 'John', b: 'Jane', c: 'Jack' }
 *
 * // Convert the names to uppercase.
 * mapValues(object, item => item.name.first.toUpperCase()) // => { a: 'JOHN', b: 'JANE', c: 'JACK' }
 */
export function mapValues(collection: object, iteratorOrPath?: IteratorFunction | string): unknown
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
