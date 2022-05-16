import { Iterator, Key } from '../types'

interface MapKeys {
  <T, R extends Key>(object: Array<T>, iterator: Iterator<T, R>): Record<R, T>
  <T, K extends Key, R extends Key>(object: Record<K, T>, iterator: Iterator<T, R>): Record<R, T>
}

/**
 *
 * @param object
 * @param iterator
 */
export const mapKeys: MapKeys = (object: any, iterator: any) => {
  const entries = Array.isArray(object)
    ? object.map((value, key) => [iterator(<any>value, <any>key), value])
    : Object.entries(object).map(([key, value]) => [iterator(<any>value, <any>key), value])
  return Object.fromEntries(entries)
}
