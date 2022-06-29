import { Collection, IteratorFunction, Key, Literal, Path, Value, Values } from '../types'
import { get } from './get'

interface GroupBy {
  <T, K extends Path<T>>(object: Collection<T>, path: K): Record<Literal<Value<T, K>>, Array<T>>
  <T, R extends Key>(object: T, iterator: IteratorFunction<T, R>): Record<R, Array<Values<T>>>
}

/**
 * Groups an array or object by the result of an iterator function.
 * @param object The array or object to group
 * @param iterator The iterator function or path
 * @returns The grouped object
 */
export const groupBy: GroupBy = (object: any, iterator: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Iterate over object properties and push them in the correct group.
  const result: any = {}
  for (const key in object) {
    const value = object[key]
    const groupKey = iterator(value, key, object)
    if (groupKey in result) result[groupKey].push(value)
    else result[groupKey] = [value]
  }

  // --- Return result.
  return result
}
