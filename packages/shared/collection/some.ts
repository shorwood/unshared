import { Collection, IteratorFunction } from '../types'

interface Some {
  <T>(array: Collection<T>, iterator: IteratorFunction<T, boolean>): boolean
  <T>(array: Collection<T>, value: T): boolean
}

/**
 * Checks if some object or array values predicates a function
 * @param {Array<T>|Record<string, T>} object The object or array to check
 * @param {Function|any} iterator A function that returns true if the value should be included
 * @returns {boolean} True if there is at least one value, false otherwise
 */
export const some: Some = (object: any, iterator: any): boolean => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const value = iterator
    iterator = (v: any) => v === value
  }

  // --- Some values.
  return Array.isArray(object)
    ? object.some(iterator)
    : Object.entries(object).some(([key, value]) => iterator(value, key, object))
}
