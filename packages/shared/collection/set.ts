import { Path } from '../types/collection'

/**
  * Set a value of a nested object's property by a path of keys.
  * If the path does not exist, it will be created.
  *
  * This function will mutate the original object.
  * @param object The object to set the value to
  * @param path The path of keys separated by a dot
  * @param value The value to set to the path
  * @returns The object with the value set to the path
  */
export function set<T extends object, K extends Path<T>>(object: T, path: K, value: any): T
export function set<T extends object>(object: T, path: string, value: any): T
export function set(object: any, path: string, value?: any): any {
  // --- Split path segments.
  const keys = typeof path === 'string' ? path.split('.') : path

  // --- Loop through the path and set the object.
  let current = object
  for (let index = 0; index < keys.length - 1; index++) {
    const key = keys[index]
    const nextKey = keys[index + 1]

    // --- If current value is undefined, create an object or array.
    // --- depending on the next key. (If next key is a number, create an array)
    if (current?.[key] === undefined)
      current[key] = /^\d+$/.test(nextKey) ? [] : {}

    // --- Set current to the next value.
    current = current[key]
  }

  // --- Set value.
  const lastkey = keys[keys.length - 1]
  current[lastkey] = value
  return object
}
