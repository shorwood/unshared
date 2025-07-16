import type { IteratorFunction, MaybeArray, Predicator, Pretty } from '@unshared/types'

type OmitByKey<T, K extends PropertyKey> =
  Pretty<{ -readonly [P in Exclude<keyof T, K>]: T[P] }>

type OmitByIterator<T, I extends IteratorFunction<T, boolean>> =
  I extends Predicator<infer P>
    ? { -readonly [K in keyof T as T[K] extends P ? never : K]: T[K] }
    : Partial<T>

/**
 * Returns a new object with the specified properties omitted.
 *
 * @param collection The collection to iterate over.
 * @param keys The keys to omit.
 * @returns A new object with the omitied properties
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2, baz: 3 }
 *
 * // Omit the `foo` property.
 * omit(object, 'foo') // => { bar: 2, baz: 3 }
 *
 * // Omit the `foo` and `bar` properties.
 * omit(object, ['foo', 'bar']) // => { baz: 3 }
 */
export function omit<T, K extends keyof T>(collection: T, keys: MaybeArray<K>): OmitByKey<T, K>
export function omit<T, K extends PropertyKey>(collection: T, keys: MaybeArray<K>): OmitByKey<T, K>

/**
 * Returns a new object with the properties omitted by the iterator function.
 *
 * @param collection The collection to iterate over.
 * @param iterator The iterator function to invoke for each item in the object.
 * @returns A new object with the omitied properties
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2 }
 *
 * // Omit propeties that have an even value.
 * omit(object, value => value % 2 === 0) // => { foo: 1 }
 */
export function omit<T, I extends IteratorFunction<T, boolean>>(collection: T, iterator: I): OmitByIterator<T, I>

/**
 * Returns a new object with the properties omitted by the iterator function or the keys.
 *
 * @param object The object to iterate over.
 * @param pathOrIterator The keys to omit or the iterator function to invoke for each item in the object.
 * @returns A new object with the omitted properties.
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2, baz: 3 }
 *
 * // Omit the `foo` property.
 * omit(object, 'foo') // => { bar: 2, baz: 3 }
 *
 * // Omit the `foo` and `bar` properties.
 * omit(object, ['foo', 'bar']) // => { baz: 3 }
 *
 * // Omit properties that have an even value.
 * omit(object, value => value % 2 === 0) // => { foo: 1 }
 */
export function omit(object: object, pathOrIterator: IteratorFunction<object, boolean> | MaybeArray<string>): unknown
export function omit(object: object, pathOrIterator: IteratorFunction<object, boolean> | MaybeArray<string>) {
  let iterator = pathOrIterator as IteratorFunction

  // --- If iterator is a path, cast as getter function.
  if (typeof pathOrIterator !== 'function') {
    const keys = Array.isArray(pathOrIterator) ? pathOrIterator : [pathOrIterator]
    iterator = (_, key) => keys.includes(key as string)
  }

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => !iterator(value, key, object))
  return Object.fromEntries(entries)
}
