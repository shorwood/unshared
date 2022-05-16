/* eslint-disable arrow-body-style */
import { MaybeArray } from '../types'

export type Arrayify = <T>(value: MaybeArray<T>) => Array<T>

/**
 *
 * @param value
 */
export const arrayify: Arrayify = (value) => {
  return Array.isArray(value) ? value : [value]
}
