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
 * Discards values from an array or object according to the given predicate function.
 * @param {Array|Object} object The array or object to filter
 * @param {Function} iterator The function to call for each value. If this is a path (string or array), the function will get that value.
 * @returns {Array|Object} A new array or object with only the values for which the iterator function returned false.
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
