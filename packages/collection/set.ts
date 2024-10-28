import type { Path } from '@unshared/types'

/**
 * Set a value of a nested object's property by a path of keys.
 * If the path does not exist, it will be created.
 *
 * @param object The object to set the value to
 * @param path The path of keys separated by a dot
 * @param value The value to set to the path
 * @returns The object with the value set to the path
 */
export function set<T extends object>(object: T, path: Path<T>, value: unknown): T
export function set<T extends object>(object: T, path: PropertyKey, value: unknown): T
export function set(object: Record<PropertyKey, unknown>, path: PropertyKey, value?: unknown): unknown {

  // --- If path is not a string, set the value to the path and return early.
  if (typeof path !== 'string') {
    object[path] = value
    return object
  }

  // --- Loop through the keys in the path.
  const keys = path.split('.')
  let current = object
  for (let index = 0; index < keys.length - 1; index++) {
    const key = keys[index]
    const nextKey = keys[index + 1]

    // --- If current value is undefined, create an object or array.
    // --- depending on the next key. (If next key is a number, create an array)
    if (current?.[key] === undefined) current[key] = /^\d+$/.test(nextKey) ? [] : {}

    // --- Set current to the next value.
    // @ts-expect-error: Key is guaranteed to exist.
    current = current[key]
  }

  // --- Set value.
  const lastkey = keys.at(-1)
  if (lastkey !== undefined) current[lastkey] = value
  return object
}
