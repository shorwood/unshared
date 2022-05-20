import { Key, MaybeArray } from '../types'

interface Get {
  <U>(value: any, path: MaybeArray<Key>): U | undefined
  <U>(value: any, path: MaybeArray<Key>, defaultValue: U): U
}

/**
 * Get a value from an object by a path of keys.
 * @param {any} value The object to get the value from
 * @param {MaybeArray<Key>} path The path of keys
 * @param {any} [defaultValue] The default value to return if the path does not exist
 * @returns {any} The value at the path or the default value
 */
export const get: Get = (value: any, path: MaybeArray<Key>, defaultValue?: any): any => {
  if (!Array.isArray(path)) path = [path]
  path.forEach((key: any) => value = value?.[key])
  return value ?? defaultValue
}
