import { Key, MaybeArray } from '../types'
import { get } from './get'

interface Filter {
  <T>(array: Array<T>, path: MaybeArray<Key>): Array<T>
  <T>(array: Array<T>, iterator: (value: T, key: number, array: Array<T>) => boolean): Array<T>
  <T>(array: Array<T>, path: any): Array<T>
  <T>(object: Record<string, T>, path: MaybeArray<Key>): Record<string, T>
  <T>(object: Record<string, T>, iterator: (value: T, key: string, object: Record<string, T>) => boolean): Record<string, T>
  <T>(object: Record<string, T>, path: any): Record<string, T>
}

/**
 * Filters an array or object.
 * @param {Array|Object} object The array or object to filter
 * @param {Function|string} iterator The function or path to use for filtering
 * @returns {Array|Object} The filtered array or object
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
