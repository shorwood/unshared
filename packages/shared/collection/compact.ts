import { NotNil } from '../types/common'

/**
 * Filters out `undefined` and `null` values from an array.
 * @param {Array<T>} value The array to filter
 * @returns {Array<NonNullable<T>>} The filtered array
 */
export const compact = <T>(value: Array<T>): Array<NotNil<T>> =>
  value.filter(x => typeof x !== 'undefined' && x !== null) as any
