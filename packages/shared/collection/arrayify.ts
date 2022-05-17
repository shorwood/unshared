/* eslint-disable arrow-body-style */
import { MaybeArray } from '../types'

/**
 *
 * @param value
 */
export const arrayify = <T>(value: MaybeArray<T>): Array<T> => {
  return Array.isArray(value) ? value : [value]
}
