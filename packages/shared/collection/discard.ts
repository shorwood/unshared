import { Key, MaybeArray } from '../types'
import { get } from './get'

interface Discard {
  <T>(array: Array<T>, path: MaybeArray<Key>): Array<T>
  <T>(array: Array<T>, iterator: (value: T, key: number, array: Array<T>) => boolean): Array<T>
  <T>(array: Array<T>, path: any): Array<T>
  <T>(object: Record<string, T>, path: MaybeArray<Key>): Record<string, T>
  <T>(object: Record<string, T>, iterator: (value: T, key: string, object: Record<string, T>) => boolean): Record<string, T>
  <T>(object: Record<string, T>, path: any): Record<string, T>
}

/**
 *
 * @param object
 * @param iterator
 */
export const discard: Discard = (object: any, iterator: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- If array, use built-in function.
  if (Array.isArray(object))
    return object.filter((value, index, array) => !iterator(value, index, array))

  // --- If object, filter entries.
  const entries = Object.entries(object).filter(([key, value]) => !iterator(value, key, object))
  return Object.fromEntries(entries)
}
