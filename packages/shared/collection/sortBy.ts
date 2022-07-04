import { compare } from '../misc/compare'

// TODO: Implement `get` path iterator
// TODO: Implement `sortBy` values iterator: `sort(array)`
// TODO: Rename `sortBy` with `sort`

interface SortBy {
  <T, K extends keyof T>(array: Array<T>, path: K): Array<T>
  <T>(array: Array<T>, iterator: (value: T, key: number, array: Array<T>) => any): Array<T>
}

/**
 * Sorts an array by the result of an iterator function.
 * @param {Array} array The array to sort
 * @param {Function} iterator The iterator function or path
 * @returns {Array} The sorted array
 */
export const sortBy: SortBy = (array: Array<any>, iterator: any): Array<any> => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => value[path]
  }

  // --- Sort with custom comparator.
  return array.sort((a: any, b: any) => compare(
    iterator(a),
    iterator(b),
  ))
}
