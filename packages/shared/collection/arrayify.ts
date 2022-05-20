import { MaybeArray } from '../types'

/**
 * Converts a value into an array if it is not one already.
 * @param {T} value The value to convert
 * @returns {Array<T>} The array
 */
export const arrayify = <T>(value: MaybeArray<T>): Array<T> => (
  Array.isArray(value) ? value : [value]
)
