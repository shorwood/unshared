import type { FromEntries, Get, IteratorFunction, IteratorPath, MaybeLiteral } from '@unshared/types'
import { get } from './get'
import { isIterable } from './isIterable'

type GroupedByPath<T, P extends IteratorPath<T>> =
  T extends readonly unknown[] ? FromEntries<Array<[PropertyKey, unknown]> & { [K in keyof T]: [Get<T[K], P>, T[K]] }> extends infer U ? { -readonly [K in keyof U]: Array<U[K]> } : never
    : T extends Iterable<infer U> ? { [K in keyof T as Get<U, P> & PropertyKey]: U[] }
      : { -readonly [K in keyof T as Get<T[K], P> & PropertyKey]: Array<T[K]> }

type GroupedByIterator<T, R extends PropertyKey> =
  T extends ReadonlyArray<infer U> ? { -readonly [K in keyof T as R]: U[] }
    : T extends Iterable<infer U> ? { [K in keyof T as R]: U[] }
      : { [K in keyof T as R]: Array<T[K]> } extends infer U ? { -readonly [K in keyof U]: U[K] } : never

/**
 * Groups a collection by the result of an iterator function.
 *
 * @param collection The collection to group.
 * @param iterator The iterator function to determine the group of each item.
 * @returns An object where the keys are the groups and the values are the items in each group.
 * @example
 * // Declare a collection.
 * const collection = [
 *   { id: 1, group: 'a' },
 *   { id: 2, group: 'a' },
 *   { id: 3, group: 'b' },
 *   { id: 4, group: 'b' },
 * ]
 *
 * // Group the collection by the value of the `group` property.
 * groupBy(collection, item => item.group)
 * // {
 * //   a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
 * //   b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
 * // }
 */
export function groupBy<T, R extends PropertyKey>(collection: T, iterator: IteratorFunction<T, R>): GroupedByIterator<T, R>

/**
 * Groups a collection by the value of a property at a given path.
 *
 * @param collection The collection to group.
 * @param path The path to the property to group by.
 * @returns An object where the keys are the groups and the values are the items in each group.
 * @example
 * // Declare a collection.
 * const collection = [
 *   { id: 1, group: 'a' },
 *   { id: 2, group: 'a' },
 *   { id: 3, group: 'b' },
 *   { id: 4, group: 'b' },
 * ]
 *
 * // Group the collection by the value of the `group` property.
 * groupBy(collection, 'group')
 * // {
 * //   a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
 * //   b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
 * // }
 */
export function groupBy<T, P extends IteratorPath<T>>(collection: T, path: MaybeLiteral<P>): GroupedByPath<T, P>
export function groupBy(collection: object, iteratorOrPath: IteratorFunction<unknown, PropertyKey> | string): unknown
export function groupBy(collection: object, iteratorOrPath: IteratorFunction<unknown, PropertyKey> | string): unknown {

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

  // --- Get the entries of the object and iterate over them if necessary.
  const originalObject = collection
  const entries = isIterable(collection)
    ? [...collection].map((value, key) => [key, value] as const)
    : Object.entries(collection)

  // --- Compute the group of each entry and add it to the result accordingly.
  const result: Record<PropertyKey, unknown[]> = {}
  for (const [key, value] of entries) {
    const groupKey = iterator(value, key, originalObject)
    if (groupKey in result) result[groupKey].push(value)
    else result[groupKey] = [value]
  }

  // --- Return result.
  return result as unknown
}
