import { Collection, IteratorFunction } from '@unshared/types'
import { isIterable } from './isIterable'

/**
 * Maps the entries in an object or array and returns a new object with the
 * mapped entries. This function is similar to `Array.prototype.map` but for
 * all kinds of collections and allows you to iterate over the keys and values
 * of an object in a single pass.
 *
 * @param collection The collection to map entries for.
 * @param iterator An iterator function that returns the new key for each entry.
 * @returns The new object with mapped keys
 */
export function mapEntries<T, K extends PropertyKey, R>(collection: T, iterator: IteratorFunction<T, readonly [K, R]>): Record<K, R>
export function mapEntries(collection: Collection, iterator: IteratorFunction) {
  if (isIterable(collection)) {
    const entries = [...collection].map((value, key) => iterator(value, key, collection))
    return Object.fromEntries(entries as Array<[PropertyKey, unknown]>)
  }

  const entries = Object
    .entries(collection )
    .map(([key, value]) => iterator(value, key, collection))

  // --- Cast as object.
  return Object.fromEntries(entries as Array<[PropertyKey, unknown]>)
}


