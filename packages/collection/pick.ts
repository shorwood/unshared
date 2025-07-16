import type { IteratorFunction, MaybeArray, Predicator, Pretty } from '@unshared/types'

type PickByKey<T, K extends PropertyKey> =
  Pretty<{ -readonly [P in Extract<keyof T, K>]: T[P] }>

type PickByIterator<T, I extends IteratorFunction<T, boolean>> =
  I extends Predicator<infer P>
    ? { -readonly [K in keyof T as T[K] extends P ? K : never]: T[K] }
    : Partial<T>

/**
 * Returns a new object with the specified properties pickted.
 *
 * @param collection The collection to iterate over.
 * @param keys The keys to pick.
 * @returns A new object with the pickied properties
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2, baz: 3 }
 *
 * // Pick the `foo` property.
 * pick(object, 'foo') // => { foo: 1 }
 *
 * // Pick the `foo` and `bar` properties.
 * pick(object, ['foo', 'bar']) // => { foo: 1, bar: 2 }
 */
export function pick<T, K extends keyof T>(collection: T, keys: MaybeArray<K>): PickByKey<T, K>
export function pick<T, K extends PropertyKey>(collection: T, keys: MaybeArray<K>): PickByKey<T, K>

/**
 * Returns a new object with the properties pickted by the iterator function.
 *
 * @param collection The collection to iterate over.
 * @param iterator The iterator function to invoke for each item in the object.
 * @returns A new object with the pickied properties
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2 }
 *
 * // Pick propeties that have an even value.
 * pick(object, value => value % 2 === 0) // => { bar: 2 }
 */
export function pick<T, I extends IteratorFunction<T, boolean>>(collection: T, iterator: I): PickByIterator<T, I>

/**
 * Returns a new object with the properties pickted by the iterator function or the keys.
 *
 * @param collection The object to iterate over.
 * @param pathOrIterator The keys to pick or the iterator function to invoke for each item in the object.
 * @returns A new object with the pickied properties.
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2, baz: 3 }
 *
 * // Pick the `foo` property.
 * pick(object, 'foo') // => { foo: 1 }
 *
 * // Pick the `foo` and `bar` properties.
 * pick(object, ['foo', 'bar']) // => { foo: 1, bar: 2 }
 *
 * // Pick properties that have an even value.
 * pick(object, value => value % 2 === 0) // => { bar: 2 }
 */
export function pick(collection: object, pathOrIterator: IteratorFunction<object, boolean> | MaybeArray<string>): unknown
export function pick(collection: object, pathOrIterator: IteratorFunction<object, boolean> | MaybeArray<string>) {
  let iterator = pathOrIterator as IteratorFunction

  // --- If iterator is a path, cast as getter function.
  if (typeof pathOrIterator !== 'function') {
    const keys = Array.isArray(pathOrIterator) ? pathOrIterator : [pathOrIterator]
    iterator = (_, key) => keys.includes(key as string)
  }

  // --- Filter entries.
  const entries = Object.entries(collection).filter(([key, value]) => iterator(value, key, collection))
  return Object.fromEntries(entries)
}
