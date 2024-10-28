import type { Get, Path } from '@unshared/types'

/**
 * Get the value of a nested property in an object safely. If the path does not exist,
 * the function will return `undefined`. It can be useful when you want to get a nested
 * property in an object without having to check if the path exists first.
 *
 * The path is a string of keys separated by a `.`
 *
 * @param object The object to get the value from.
 * @param path The path to the value to get.
 * @returns The value at the path of the object.
 * @example
 * // Create an object.
 * const object = { foo: { bar: ['baz'] } }
 *
 * // Get the value.
 * get(object, 'foo.bar.0') // 'baz'
 */
export function get<T, P extends Path<T>>(object: T, path: P): Get<T, P>
export function get(object: unknown, path: string): unknown
export function get(object: unknown, path: string) {
  const keys = path.split('.')

  // --- Loop through the path and get the object.
  let result = object
  for (const key of keys) {
    if (result === undefined || result === null) return

    // @ts-expect-error: Invalid keys will be caught by the try/catch.
    result = result[key] as unknown
  }

  // --- Return result.
  return result
}
