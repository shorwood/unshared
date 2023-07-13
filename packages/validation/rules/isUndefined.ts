/**
 * Check if value is undefined
 *
 * @param value The value to check
 * @returns `true` if value is undefined, `false` otherwise
 * @example
 * isUndefined(null) // false
 * isUndefined(undefined) // true
 */
export const isUndefined = (value: any): value is undefined =>
  value === undefined
