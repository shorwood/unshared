import type { IteratorFunction, MaybeLiteral, Path } from '@unshared/types'
import { get } from './get'

/**
 * Returns a new array containing only unique values. The uniqueness is
 * based on strict equality comparison.
 *
 * @param array The array to make unique.
 * @returns A new array containing only unique values.
 * @example toUnique([1, 2, 3])
 */
export function toUnique<T>(array: T[]): T[]

/**
 * Returns a new array with unique elements based on the provided iterator function.
 *
 * @param array The array to filter for unique elements
 * @param iterator The iterator function to determine uniqueness
 * @returns A new array containing only unique elements
 * @example
 * // Using iterator function.
 * toUnique(['hello', 'world', 'WORLD'], value => value.toLowerCase()) // ['hello', 'world']
 */
export function toUnique<T>(array: T[], iterator: IteratorFunction<T[], string>): T[]

/**
 * Returns a new array with unique elements based on the provided property path.
 *
 * @param array The array to filter for unique elements
 * @param path The property path to determine uniqueness
 * @returns A new array containing only unique elements
 * @example
 *
 * // Using key.
 * toUnique([{ id: 1 }, { id: 2 }, { id: 1 }], 'id') // [{ id: 1 }, { id: 2 }]
 *
 * // Using nested property path.
 * toUnique([{ a: { id: 1 } }, { a: { id: 2 } }, { a: { id: 1 } }], 'a.id') // [{ a: { id: 1 } }, { a: { id: 2 } }]
 */
export function toUnique<T extends object, P extends Path<T>>(array: T[], path: MaybeLiteral<P>): T[]

/**
 * Returns a new array with unique elements based on the provided iterator function or property path.
 *
 * @param array The array to filter for unique elements
 * @param iteratorOrPath Optional iterator function or property path to determine uniqueness
 * @returns A new array containing only unique elements
 *
 * @example
 * // Using with primitive values
 * toUnique([1, 2, 2, 3, 1]) // [1, 2, 3]
 *
 * // Using with iterator function
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 1, name: 'John' }]
 * toUnique(users, user => user.id) // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 *
 * // Using with property path
 * toUnique(users, 'id') // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 */
export function toUnique(array: unknown[], iteratorOrPath?: IteratorFunction<unknown[]> | string): unknown[]
export function toUnique(array: unknown[], iteratorOrPath?: IteratorFunction<unknown[]> | string) {
  const seen = new Set<unknown>()
  const result: unknown[] = []

  // --- Compute iterator function.
  let iterator: IteratorFunction<unknown[]> = value => value
  if (typeof iteratorOrPath === 'function') iterator = iteratorOrPath
  if (typeof iteratorOrPath === 'string') iterator = value => get(value, iteratorOrPath)

  // --- Pick unseen elements.
  for (const [key, item] of array.entries()) {
    const identifier = iterator(item, key, array)
    const isSeen = seen.has(identifier)
    if (isSeen) continue
    seen.add(identifier)
    result.push(item)
  }

  // --- Return unique results.
  return result
}
