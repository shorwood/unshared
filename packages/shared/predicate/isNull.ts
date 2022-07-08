/**
 * Check if value is null
 * @param value The value to check
 * @returns {boolean} `true` if value is null, `false` otherwise
 * @example
 * isNull(0) // false
 * isNull(null) // true
 * isNull(undefined) // false
 */
export const isNull = (value: any): value is null =>
  value === null
