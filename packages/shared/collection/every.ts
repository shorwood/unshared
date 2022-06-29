import { Collection, IteratorFunction } from '../types'

interface Every {
  <T, U>(array: T, iterator: IteratorFunction<T, U>): boolean
  <T>(array: Collection<T>, value: T): boolean
}

/**
 * Checks if every object or array values predicates a function
 * @param {Array<T>|Record<string, T>} object The object or array to check
 * @param {Function|any} iterator A function that returns true if the value should be included
 * @returns {boolean} True if there is at least one value, false otherwise
 */
export const every: Every = (object: any, iterator: any): boolean => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const value = iterator
    iterator = (v: any) => v === value
  }

  // --- Every values.
  return Array.isArray(object)
    ? object.every(iterator)
    : Object.entries(object).every(([key, value]) => iterator(value, key, object))
}
