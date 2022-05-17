import { Key, MaybeArray } from '../types'
import { get } from './get'

interface GroupBy {
  <T>(object: Array<T>, path: MaybeArray<Key>): Record<string, T[]>
  <T>(object: Array<T>, iterator: (value: T, key: number, array: Array<T>) => string): Record<string, T[]>
  <T>(object: Record<string, T>, path: MaybeArray<Key>): Record<string, T[]>
  <T>(object: Record<string, T>, iterator: (value: T, key: number, object: Record<string, T>) => string): Record<string, T[]>
}

/**
 *
 * @param object
 * @param iterator
 */
export const groupBy: GroupBy = (object, iterator: any) => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Iterate over object properties and push them in the correct group.
  const result: Record<string, any[]> = {}
  for (const key in object) {
    // @ts-expect-error: Array/Object getter.
    const value = object[key]
    const groupKey = iterator(value, key, object)
    const group = result[groupKey] ?? []
    group.push(value)
  }

  // --- Return result.
  return result
}
