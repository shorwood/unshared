import { IteratorFunction, MaybeArray } from '../types'

interface Discard {
  <T>(array: Array<T>, iterator: IteratorFunction<T, boolean>): Array<T>
  <T>(array: Array<T>, discarded: MaybeArray<T>): Array<T>
}

/**
 * Discards values from an array according to the given predicate function.
 * @param {Array|Object} object The array to filter
 * @param {Function} iterator The function to call for each value. If this is a path (string or array), the function will get that value.
 * @returns {Array|Object} A new array with only the values for which the iterator function returned false.
 */
export const discard: Discard = (object: Array<any>, iterator: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const discarded = Array.isArray(iterator) ? iterator : [iterator]
    iterator = (value: any) => discarded.includes(value)
  }

  // --- If array, use built-in function.
  return object.filter((value, index, array) => !iterator(value, index, array))
}
