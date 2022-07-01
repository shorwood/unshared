import { Default, Path, Value } from '../types'

interface Get {
  <T, K extends Path<T>, U>(value: T, path: K, defaultValue: U): Default<Value<T, K>, U>
  <T, K extends Path<T>>(value: T, path: K): Value<T, K>
  <T, U>(value: T, path: string, defaultValue: U): any
  <T>(value: T, path: string): any
}

/**
 * Get a value from an object by a path of keys.
 * @param {any} value The object to get the value from
 * @param {string} path The path of keys separated by a dot
 * @param {any} [defaultValue] The default value to return if the path does not exist
 * @returns {any} The value at the path or the default value
 */
export const get: Get = (value: any, path: string, defaultValue?: any): any => {
  // --- Split path segments.
  const keys = typeof path === 'string'
    ? path.split('.')
    : path

  // --- Loop through the path and get the value.
  let result = value
  for (const key of keys) {
    if (result?.[key] !== undefined) result = result[key]
    else return defaultValue
  }

  // --- Return result.
  return result
}
