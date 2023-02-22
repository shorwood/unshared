import { Key } from '@unshared/types/Key'
import { Collection } from '@unshared/types/Collection'

/**
 * Cast a collection into an array.
 *
 * @param object The collection to cast as an array.
 * @returns An array of items.
 * @example values({ key1: { foo: 'bar' }}) // [{ foo: 'bar'}]
 */
export function values<T>(object: Collection<T>): Array<T>
/**
 * Cast a collection into an array and keep store the original key in the properties of each item.
 *
 * @param object The collection to cast as an array.
 * @param key The name of the property to store the original key.
 * @returns An array of items.
 * @example values({ key1: { foo: 'bar' }}) // [{ foo: 'bar', key: 'key1' }]
 */
export function values<U, K1 extends Key, K2 extends Key>(object: Record<K1, U>, key?: K2): Array<U & Record<K2, K1>>
export function values(object: object, key?: string | number | symbol): unknown[] {
  // --- If no key was provided, just return values.
  if (key === undefined) return Object.values(object)

  // --- If key is provided but of invalid type, throw error.
  if (typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'symbol')
    throw new TypeError('Cannot use a non-string/number/symbol value as key name.')

  // --- Iterate over value's keys.
  return Object.entries(object).map(([originalKey, value]) => ({ [key]: originalKey, ...value }))
}
