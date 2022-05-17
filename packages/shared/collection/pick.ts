import { MaybeArray } from '../types'

interface IPick {
  <T extends object, K extends keyof T>(object: T, path: MaybeArray<K>): Pick<T, K>
  <T extends object, K extends keyof T>(object: T, iterator: (value: T[K], key: K, object: T) => boolean): Partial<T>
  <T extends object>(object: T, path: any): Partial<T>
}

/**
 *
 * @param object
 * @param iterator
 */
export const pick: IPick = (object: any, iterator?: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const paths = Array.isArray(iterator) ? iterator : [iterator]
    iterator = (value: any, key: any) => paths.includes(key)
  }

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => iterator(value, key, object))
  return Object.fromEntries(entries)
}
