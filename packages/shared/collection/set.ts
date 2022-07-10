import { Path } from '../types/collection'

interface Set {
  <T extends object, K extends Path<T>>(object: T, path: K, value: any): T
  <T extends object>(object: T, path: string, value: any): T
}

/**
  * Set a value of a nested object's property by a path of keys.
  * If the path does not exist, it will be created.
  * @param {any} object The object to set the value to
  * @param {string} path The path of keys separated by a dot
  * @param {any} value The value to set to the path
  */
export const set: Set = (object: any, path: string, value?: any): any => {
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
