/**
 * Collection of items in the form of an object or an array.
 *
 * @template T The type of the items in the collection.
 * @returns The collection.
 * @example Collection<number> // Iterable<number> | Record<PropertyKey, number> | readonly number[]
 */
export type Collection<T = unknown> =
  | Iterable<T>
  | Record<PropertyKey, T>
  | readonly T[]
