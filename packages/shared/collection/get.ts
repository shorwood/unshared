import { Path, Value } from '../types/collection'
import { Default } from '../types/common'

interface Get {
  <T, K extends Path<T>, U>(object: T, path: K, defaultValue?: U): Default<Value<T, K>, U>
  <T, R, U>(object: T, getter: (object: T) => R, defaultValue?: U): Default<R, U>
  <T, U>(object: T, ignored: undefined | null, defaultValue?: U): Default<T, U>
  <T, U>(object: T, pathOrGetter?: string | Function | null, defaultValue?: U): Default<T, U>
}

/**
 * Get a value from a nested object's property by a path of keys.
 * @param {any} object The object to get the object from
 * @param {string} pathOrGetter The path to the property or a getter function
 * @param {any} [defaultValue] The default object to return if the path does not exist
 * @returns {any} The object at the path or the default object
 */
export const get: Get = (object: any, pathOrGetter: any, defaultValue?: any): any => {
  if (typeof pathOrGetter === 'undefined') return object
  if (pathOrGetter === null) return object

  // --- If the path is a function, call it and return the result.
  if (typeof pathOrGetter === 'function')
    return pathOrGetter(object) ?? defaultValue

  // --- Split path segments.
  const keys = typeof pathOrGetter === 'string'
    ? pathOrGetter.split('.')
    : pathOrGetter

  // --- Loop through the path and get the object.
  let result = object
  for (const key of keys) {
    if (result?.[key] !== undefined) result = result[key]
    else return defaultValue
  }

  // --- Return result.
  return result
}
