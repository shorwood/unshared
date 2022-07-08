/**
 * Check if value is not undefined
 * @param value The value to check
 * @returns {boolean} `true` if value is not undefined, `false` otherwise
 * @example
 * isNotUndefined(0) // true
 * isNotUndefined(null) // true
 * isNotUndefined(undefined) // false
 */
export const isNotUndefined = <T>(value: T): value is Exclude<T, undefined> =>
  typeof value !== 'undefined'
