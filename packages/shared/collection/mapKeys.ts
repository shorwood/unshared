interface MapKeys {
  <T>(object: Array<T>, path: keyof T): Record<string, T>
  <T>(object: Array<T>, iterator: (value: T, key: keyof T, array: Array<T>) => string): Record<string, T>
  <T>(object: Record<string, T>, path: keyof T): Record<string, T>
  <T>(object: Record<string, T>, iterator: (value: T, key: keyof T, object: Record<string, T>) => string): Record<string, T>
}

/**
 * Maps keys in an object or array.
 * @param {Array<T>|Record<string, T>} object The object or array to map keys for
 * @param {Function|keyof T} iterator The iterator function or path
 * @returns {Record<string, T>} The new object with mapped keys
 */
export const mapKeys: MapKeys = (object: any, iterator: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => value[path]
  }

  // --- Map entries.
  const entries = Array.isArray(object)
    ? object.map((value, key, object) => [iterator(value, key, object), value])
    : Object.entries(object).map(([key, value]) => [iterator(value, key, object), value])

  // --- Cast as object.
  return Object.fromEntries(entries)
}
