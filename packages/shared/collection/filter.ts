import { Iterator, MaybeArray } from '../types'

interface IPick {
  <T extends Record<K, any>, K extends keyof T>(object: T, path: MaybeArray<K>): Pick<T, K>
  <T extends Record<K, any>, K extends keyof T>(object: T, iterator: Iterator<T, K, boolean>): Partial<T>
}

/**
 *
 * @param object
 * @param iterator
 */
export const pick: IPick = (object: any, iterator?: any): any => {
  if (typeof iterator !== 'function') iterator = (v: any, k: any) => v[k]
  const entries = Object.entries(object).filter(([key, value]) => iterator(value, key, object))
  return Object.fromEntries(entries)
}
