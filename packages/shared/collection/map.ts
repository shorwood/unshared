import { Key, MaybeArray } from '../types'
import { get } from './get'

interface Map {
  <U, T = any>(object: Array<T>, path: MaybeArray<Key>): U[]
  <U, T = any>(object: Array<T>, iterator: (value: T, key: number, array: Array<T>) => U): U[]
  <U, T = any>(object: Record<string, T>, path: MaybeArray<Key>): U[]
  <U, T = any>(object: Record<string, T>, iterator: (value: T, key: number, object: Record<string, T>) => U): U[]
}

/**
 *
 * @param object
 * @param iterator
 */
export const map: Map = (object, iterator: any) => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Map array values or object entries.
  return Array.isArray(object)
    ? object.map(iterator)
    : Object.entries(object).map(([key, value]) => iterator(value, key, object))
}
