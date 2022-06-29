import { Collection, IteratorFunction, Path, Value, Values } from '../types'
import { get } from './get'

interface Map {
  <T, K extends Path<T>>(object: Collection<T>, path: K): Value<T, K>[]
  <T, R>(collection: T, iterator: IteratorFunction<T, R>): R[]
  <T>(collection: T): Values<T>[]
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
 * @param collection The object or array to iterate over
 * @param iterator The callback function or path to iterate over
 * @returns A new array consisting of the results of the callback function
 */
export const map: Map = (collection: any, iterator?: any): any => {
  if (iterator === undefined) {
    return Array.isArray(collection)
      ? collection
      : Object.values(collection)
  }

  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Map values.
  return Array.isArray(collection)
    ? collection.map(iterator)
    : Object.entries(collection).map(([key, value]) => iterator(value, key, collection))
}
