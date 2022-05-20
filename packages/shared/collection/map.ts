import { Key, MaybeArray } from '../types'
import { get } from './get'

interface Map {
  <U, T = any>(object: Array<T>, path: MaybeArray<Key>): U[]
  <U, T = any>(object: Array<T>, iterator: (value: T, key: number, array: Array<T>) => U): U[]
  <U, T = any>(object: Record<string, T>, path: MaybeArray<Key>): U[]
  <U, T = any>(object: Record<string, T>, iterator: (value: T, key: number, object: Record<string, T>) => U): U[]
}

/**
 * Iterates over an object or array, returning a new array
 * consisting of the results of the callback function or path.
 *
 * If path is supplied, it will be used to iterate over the object or array.
 *
 * If a callback is supplied, it will be invoked for each item in the object or array.
 * The callback can return a new value to be added to the new object or array.
 *
 * @param {Array|Object} object The object or array to iterate over
 * @param {MaybeArray<Key>|Function} iterator The callback function or path to iterate over
 * @returns {Array|Object} A new array consisting of the results of the callback function
 */
export const map: Map = (object, iterator: any) => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Map values.
  return Array.isArray(object)
    ? object.map(iterator)
    : Object.entries(object).map(([key, value]) => iterator(value, key, object))
}
