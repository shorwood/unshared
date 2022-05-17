import { compare } from '../misc'
import { Key, MaybeArray } from '../types'
import { get } from './get'

interface Sort {
  <T>(array: Array<T>, path: MaybeArray<Key>): Array<T>
  <T>(array: Array<T>, iterator: (value: T, key: number, array: Array<T>) => any): Array<T>
  <T>(array: Array<T>, path: any): Array<T>
}

/**
 *
 * @param array
 * @param iterator
 */
export const sort: Sort = (array: any, iterator: any) => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Define comparator.
  const comparator = (a: any, b: any) => compare(
    iterator(a),
    iterator(b),
  )

  // --- Sort.
  return array.sort(comparator)
}
