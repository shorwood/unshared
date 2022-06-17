interface Map {
  <T, K extends keyof T>(object: Array<T>, path: K): T[K]
  <T, U>(object: Array<T>, iterator: (value: T, key: number, array: Array<T>) => U): U[]
  <T, K extends keyof T>(object: Record<string, T>, path: K): T[K]
  <T, U>(object: Record<string, T>, iterator: (value: T, key: keyof T, object: Record<string, T>) => U): U[]
}

/**
 * Iterates over an object or array, returning a new array
 * consisting of the results of the callback function or path.
 *
 * If path is supplied, it will be used to iterate over the object or array.
 *
 * If a callback is supplied, it will be invoked for each item in the object or array.
 * The callback can return a new value to be added to the new object or array.
 *
 * @param object The object or array to iterate over
 * @param iterator The callback function or path to iterate over
 * @returns A new array consisting of the results of the callback function
 */
export const map: Map = (object: any, iterator: any) => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => value[path]
  }

  // --- Map values.
  return Array.isArray(object)
    ? object.map(iterator)
    : Object.entries(object).map(([key, value]) => iterator(value, key, object))
}
