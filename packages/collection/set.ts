import type { Path } from '@unshared/types'

/**
 * Set a value of a nested object's property by a path of keys.
 * If the path does not exist, it will be created.
 * The function is protected against prototype pollution attacks by
 * blocking dangerous property keys like '__proto__', 'constructor', and 'prototype'.
 *
 * @param object The object to set the value to
 * @param path The path of keys separated by a dot
 * @param value The value to set to the path
 * @returns The object with the value set to the path
 * @throws {Error} If a dangerous property key is detected
 */
export function set<T extends object>(object: T, path: Path<T>, value: unknown): T
export function set<T extends object>(object: T, path: PropertyKey, value: unknown): T
export function set(object: Record<PropertyKey, unknown>, path: PropertyKey, value?: unknown): unknown {

  // --- If path is not a string, check if it's safe and set the value to the path
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

    // --- Check for dangerous keys in the path
    if (key === '__proto__' || key === 'constructor' || key === 'prototype')
      throw new Error(`Prototype pollution attempt detected: ${key}`)

    // --- If current value is undefined, create an object or array.
    // --- depending on the next key. (If next key is a number, create an array)
    if (current?.[key] === undefined) current[key] = /^\d+$/.test(nextKey) ? [] : {}

    // --- Set current to the next value.
    // @ts-expect-error: Key is guaranteed to exist.
    current = current[key]
  }

  // --- Set value.
  const lastkey = keys.at(-1)
  if (lastkey !== undefined) {
    if (lastkey === '__proto__' || lastkey === 'constructor' || lastkey === 'prototype')
      throw new Error(`Prototype pollution attempt detected: ${lastkey}`)
    current[lastkey] = value
  }
  return object
}
