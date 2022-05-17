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
 *
 * @param object
 * @param iterator
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
