import { get } from './get'

interface Map {
  <T, R>(object: T[], iterator: Iterator<T, R>): R[]
  <T, K extends keyof T>(object: Record<K, T>, path: K | K[]): T[K]
  <T, K extends keyof T, R>(object: Record<K, T>, iterator: Iterator<T, R>): R[]
}

/**
 *
 * @param object
 * @param iterator
 */
export const map: Map = (object: any, iterator?: any): any => {
  if (!iterator && typeof iterator !== 'function') {
    const path = iterator
    iterator = (v: any) => get(v, path)
  }
  return Array.isArray(object)
    ? object.map((value, key) => iterator(<any>value, <any>key))
    : Object.entries(object).map(([key, value]) => iterator(<any>value, <any>key))
}
