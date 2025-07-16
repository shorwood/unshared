/* eslint-disable sonarjs/pseudo-random */
import type { Collection, NumberIntegerPositive, Tuple } from '@unshared/types'

/**
 * Returns a single item randomly sampled from a collection.
 *
 * @param collection The collection to sample from
 * @returns A random item from the array
 * @example
 * // Create a collection.
 * const collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 * // Sample a random item from the collection.
 * sample(collection) // => 3
 */
export function sample<T>(collection: Collection<T>): T

/**
 * Returns a single item randomly sampled from a collection.
 *
 * @param collection The collection to sample from
 * @param size The number of items to select, if the size is 1, the output will be a single item.
 * @returns A random item from the array
 * // Create a collection.
 * const collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 * // Sample a random item from the collection.
 * sample(collection, 1) // => 3
 */
export function sample<T>(collection: Collection<T>, size: 1): T

/**
 * Returns a sample array of random items selected from a collection.
 *
 * @param collection The collection to sample from
 * @param size The number of items to sample
 * @returns An array of random items from the collection
 * @example
 * // Create a collection.
 * const collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 * // Sample 3 random items from the collection.
 * sample(collection, 3) // => [3, 7, 1]
 */
export function sample<T, N extends number = number>(collection: Collection<T>, size: NumberIntegerPositive<N>): Tuple<N, T>
export function sample(collection: Collection, size = 1) {
  if (typeof size === 'number' && size < 1)
    throw new RangeError('The sample size must be a positive number.')

  // --- Pick random items from the cloned collection.
  const copy = Object.values(collection)
  const result = Array.from({ length: size })
  for (let i = 0; i < size; i++) {
    const seed = Math.random()
    const index = Math.floor(seed * copy.length)
    result[i] = copy[index]
    copy.splice(index, 1)
  }

  // --- Return a single item or an array of items.
  return size === 1 ? result[0] : result
}
