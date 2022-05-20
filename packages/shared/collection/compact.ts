/* eslint-disable arrow-body-style */

/**
 * Filters out `undefined` and `null` values from an array.
 * @param {Array<T>} value The array to filter
 * @returns {Array<NonNullable<T>>} The filtered array
 */
export const compact = <T>(value: Array<T>): Array<NonNullable<T>> => {
  return value.filter(x => x !== undefined && x !== null) as any
}
