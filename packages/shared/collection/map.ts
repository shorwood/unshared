import { Iterator, Key, MaybeArray } from '../types'
import { get } from './get'

interface Map {
  <U, T = any>(object: Array<T>, iterator: Iterator<T[], number, U>): U[]
  <U, T = any>(object: Array<T>, path: MaybeArray<Key>): U[]
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
