import { Key, MaybeArray } from '../types'
import { get } from './get'

interface Filter {
  <T>(array: Array<T>, path: MaybeArray<Key>): Array<T>
  <T>(array: Array<T>, iterator: (value: T, key: number, array: Array<T>) => boolean): Array<T>
  <T>(array: Array<T>, path: any): Array<T>
  <T extends object, K extends keyof T>(object: T, path: K): Omit<T, K>
  <T extends object, K extends keyof T>(object: T, iterator: (value: T[K], key: K, array: T) => boolean): Partial<T>
  <T extends object>(object: T, path: any): Partial<T>
}

/**
 *
 * @param object
 * @param iterator
 */
export const filter: Filter = (object: any, iterator?: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- If array, use built-in function.
  if (Array.isArray(object))
    return object.filter(iterator)

  // --- If object, filter entries.
  const entries = Object.entries(object).filter(([key, value]) => iterator(value, key, object))
  return Object.fromEntries(entries)
}
