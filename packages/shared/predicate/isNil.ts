/**
 * Check if value is null or undefined
 * @param value The value to check
 * @returns {boolean} `true` if value is null or undefined, `false` otherwise
 * @example
 * isNil(0) // false
 * isNil(null) // true
 * isNil(undefined) // true
 */
export const isNil = (value: any): value is null | undefined =>
  typeof value === 'undefined'
  || value === null
