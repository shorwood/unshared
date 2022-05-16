import { Iterator, Key } from '../types'

interface MapValues {
  <T, R>(object: Array<T>, iterator: Iterator<T, R>): Array<R>
  <T, K extends Key, R>(object: Record<K, T>, iterator: Iterator<T, R>): Record<K, R>
}

/**
 *
 * @param object
 * @param iterator
 */
export const mapValues: MapValues = (object: any, iterator: any) => {
  const entries = Array.isArray(object)
    ? object.map((value, key) => [iterator(<any>value, <any>key), value])
    : Object.entries(object).map(([key, value]) => [key, iterator(<any>value, <any>key)])
  return Object.fromEntries(entries)
}
