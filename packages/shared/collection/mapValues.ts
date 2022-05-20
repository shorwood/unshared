import { Key, MaybeArray } from '../types'
import { get } from './get'

interface MapValues {
  <T>(object: Array<T>, path: MaybeArray<Key>): Record<string, T>
  <T, U>(object: Array<T>, iterator: (value: T, key: keyof T, array: Array<T>) => U): Record<string, U>
  <T>(object: Array<T>, iterator: any): Record<string, T>
  <T>(object: Record<string, T>, path: MaybeArray<Key>): Record<string, T>
  <T, U>(object: Record<string, T>, iterator: (value: T, key: keyof T, object: Record<string, T>) => U): Record<string, U>
  <T>(object: Record<string, T>, iterator: any): Record<string, T>
}

/**
 * Maps values of an object or array according to an iterator function or a key path.
 * @param {Array|Record} object The object to map
 * @param {Function|Array} iterator The iterator function or key path
 * @returns {Array|Record} A new object or array
 */
export const mapValues: MapValues = (object: any, iterator: any) => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Map entries.
  return Array.isArray(object)
    ? object.map(iterator)
    : Object.fromEntries(Object.entries(object).map(([key, value]) => [key, iterator(value, key, object)]))
}
