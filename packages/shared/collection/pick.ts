import { Iterator } from '../types'
import { arrayify } from './arrayify'

/**
 *
 * @param object
 * @param iterator
 */
export const pick = <T>(object: T, iterator: Iterator<T, boolean>): Partial<T> => {
  if (typeof iterator !== 'function')
    iterator = (_v, k: any) => arrayify(iterator).includes(k)
  const entries = Object.entries(object).filter(([key, value]: any) => iterator(value, key))
  return Object.fromEntries(entries) as any
}
