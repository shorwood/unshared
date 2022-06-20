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
  // --- Handle edge cases.
  if (value === null || value === undefined) return defaultValue

  // --- If `path` is an array, arrayify the path
  if (!Array.isArray(path)) path = [path]

  // --- Split path segments
  path = path.flatMap((segment: any) => {
    if (typeof segment === 'string') return segment.split('.')
    return [segment]
  })

  // --- Loop through the path and get the value.
  let result = value
  for (const key of path) {
    if (key in result) result = result[key]
    else return defaultValue
  }

  // --- Return result.
  return result
}
