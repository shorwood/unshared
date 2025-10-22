import type { Collection, Fallback, IteratorFunction, Predicator } from '@unshared/types'

/**
 * A collection of values that can be filtered using a predicator function.
 *
 * @template T The type of the collection.
 * @template I The iterator function or the path to filter.
 * @returns The filtered collection.
 * @example Filtered<{ foo: 1, bar: 2 }, 'foo'> // { foo: 1 }
 */
export type Filtered<T, I extends IteratorFunction<T, boolean>> =

  // --- Extract iterable values and the predicate type.
  T extends Iterable<infer V>
    ? I extends Predicator<infer P>
      ? Array<Fallback<Extract<V, P>, P>>
      : V[]

    // --- Extract object values and the predicate type.
    : T extends Record<PropertyKey, infer V>
      ? I extends Predicator<infer P>
        ? { -readonly [K in keyof T as T[K] extends Extract<V, P> ? K : never]: T[K] }

        // --- If the iterator is `Boolean`, the result will be non-nullable values.
        : I extends BooleanConstructor
          ? { -readonly [K in keyof T as T[K] extends NonNullable<T[K]> ? K : never]: T[K] }
          : { [K in keyof T]?: T[K] }

      // --- Fallback to the original type.
      : T

/**
 * Filter-in the values of an object or array and returns a new object or array
 * with the filtered values. This function is similar to `Array.prototype.filter`
 * but for all kinds of collections.
 *
 * @param object The source object or array.
 * @param iterator An iterator function that returns `true` to include the value.
 * @returns A new object with the picked properties.
 * @example filter({ foo: 1, bar: 2 }, value => value === 1) // => { foo: 1 }
 */
export function filter<T, I extends IteratorFunction<T, boolean>>(object: T, iterator: I): Filtered<T, I>
export function filter(object: Collection, iterator: IteratorFunction) {

  // --- If the value is an iterable, use the iterator method.
  if (Symbol.iterator in object)

    // @ts-expect-error: `object` has a `Symbol.iterator` property but it's not recognized.
    // oxlint-disable-next-line @typescript-eslint/no-unsafe-return
    return [...object].filter((value, key) => iterator(value, key, object))

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => iterator(value, key, object))
  return Object.fromEntries(entries)
}
