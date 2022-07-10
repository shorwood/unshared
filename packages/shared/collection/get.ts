import { Path, Value } from '../types/collection'
import { Default } from '../types/common'

interface Get {
  <T, K extends Path<T>, U>(object: T, path: K, defaultValue: U): Default<Value<T, K>, U>
  <T, K extends Path<T>>(object: T, path: K): Value<T, K>
  <T, U>(object: T, path: string, defaultValue: U): any
  <T>(object: T, path: string): any
}

/**
 * Get a value from a nested object's property by a path of keys.
 * @param {any} object The object to get the object from
 * @param {string} path The path of keys separated by a dot
 * @param {any} [defaultValue] The default object to return if the path does not exist
 * @returns {any} The object at the path or the default object
 */
export const get: Get = (object: any, path: string, defaultValue?: any): any => {
  // --- Split path segments.
  const keys = typeof path === 'string'
    ? path.split('.')
    : path

  // --- Loop through the path and get the object.
  let result = object
  for (const key of keys) {
    if (result?.[key] !== undefined) result = result[key]
    else return defaultValue
  }

  // --- Return result.
  return result
}
