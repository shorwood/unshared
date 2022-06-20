import { MaybeArray } from '../types'
import { arrayify } from './arrayify'

interface Filter {
  <T>(array: Array<T>, iterator: (value: T, key: number, array: Array<T>) => boolean): Array<T>
  <T>(array: Array<T>, filtered: MaybeArray<T>): Array<T>
}

/**
 * Filter values from an array according to the given predicate function.
 * @param {Array|Object} object The array to filter
 * @param {Function} iterator The function to call for each value. If this is a path (string or array), the function will get that value.
 * @returns {Array|Object} A new array with only the values for which the iterator function returned false.
 */
export const filter: Filter = (object: any, iterator: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const filtered = arrayify(iterator)
    iterator = (value: any) => filtered.includes(value)
  }

  // --- If array, use built-in function.
  return object.filter((value: any, index: any, array: any) => iterator(value, index, array))
}
