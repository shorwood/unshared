import { get } from './get'

interface MapValues {
  <T, K extends keyof T>(object: Array<T>, path: K): Record<string, T[K]>
  <T, U>(object: Array<T>, iterator: (value: T, key: keyof T, array: Array<T>) => U): Record<string, U>
  <T, K extends keyof T>(object: Record<string, T>, path: keyof T): Record<string, T[K]>
  <T, U>(object: Record<string, T>, iterator: (value: T, key: keyof T, object: Record<string, T>) => U): Record<string, U>
}

/**
 * Maps values of an object or array according to an iterator function or a key path.
 * @param object The object to map
 * @param iterator The iterator function or key path
 * @returns A new object or array
 */
export const mapValues: MapValues = (object: any, iterator: any) => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Map entries.
  return Array.isArray(object)
    ? object.map(iterator)
    : Object.fromEntries(Object.entries(object).map(([key, value]) => [key, iterator(value, key, object)]))
}
