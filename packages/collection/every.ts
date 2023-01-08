import { Collection } from '@unshared-dev/types/collection'
import { IteratorFunction } from '@unshared-dev/types/function'

interface Every {
  <T, U>(array: T, iterator: IteratorFunction<T, U>): boolean
  <T>(array: Collection<T>, value: T): boolean
}

/**
 * Checks if every object or array values predicates a function
 * @param object The object or array to check
 * @param iterator A function that returns true if the value should be included
 * @return True if there is at least one value, false otherwise
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
