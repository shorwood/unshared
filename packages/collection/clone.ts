import { isIterable } from './isIterable'

/**
 * Clones a collection by creating a new collection with the same elements. You can
 * also specify the depth at which to clone nested collections. By default, it will
 * only clone the top-level collection.
 *
 * @param collection The collection to clone.
 * @param depth If specified, the depth to clone nested collections.
 * @returns A new collection with the same elements but a different reference.
 * @example clone([1, 2, 3]) // [1, 2, 3]
 */
export function clone<T>(collection: T, depth = 1): T {

  // --- If the value is not an object, or depth limit was reached, return as is.
  if (depth === 0 || typeof collection !== 'object' || collection === null)
    return collection

  // --- Clone iterables
  if (isIterable(collection))
    return [...collection].map((element: unknown) => clone(element, depth - 1)) as T

  // --- Clone objects
  const result = {} as T
  for (const key in collection) {
    const value = collection[key]
    const cloned = clone(value, depth - 1)
    result[(key as keyof T)] = cloned
  }
  return result
}
