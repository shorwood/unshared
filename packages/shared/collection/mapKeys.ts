// TODO: Implements `get` path iterator

/**
 * Maps keys in an object or array.
 * @param object The object or array to map keys for
 * @param iterator The iterator function or path
 * @return The new object with mapped keys
 */
export function mapKeys<T>(object: Array<T>, path: keyof T): Record<string, T>
export function mapKeys<T>(object: Array<T>, iterator: (value: T, key: keyof T, array: Array<T>) => string): Record<string, T>
export function mapKeys<T>(object: Record<string, T>, path: keyof T): Record<string, T>
export function mapKeys<T>(object: Record<string, T>, iterator: (value: T, key: keyof T, object: Record<string, T>) => string): Record<string, T>
export function mapKeys(object: any, iterator: any): any {
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
