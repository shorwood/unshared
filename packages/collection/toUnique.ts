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
export function toUnique<T>(array: T[], iterator: IteratorFunction<T[], string>): T[]
export function toUnique<T extends object, P extends Path<T>>(array: T[], path: MaybeLiteral<P>): T[]
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
