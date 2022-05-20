import { MaybeArray } from '../types'

interface IOmit {
  <T extends object, K extends keyof T>(object: T, path: MaybeArray<K>): Omit<T, K>
  <T extends object, K extends keyof T>(object: T, iterator: (value: T[K], key: K, object: T) => boolean): Partial<T>
  <T extends object>(object: T, path: any): Partial<T>
}

/**
 * Returns a new object with the specified properties omitted.
 * @param {object} object The source object
 * @param {MaybeArray<string | number | symbol>} iterator The property path(s) to omit
 * @returns {object} A new object with the omitied properties
 */
export const omit: IOmit = (object: any, iterator?: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const paths = Array.isArray(iterator) ? iterator : [iterator]
    iterator = (value: any, key: any) => paths.includes(key)
  }

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => !iterator(value, key, object))
  return Object.fromEntries(entries)
}
