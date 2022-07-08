/**
 * Check if value is a valid finite number
 * @param {any} value The value to check
 * @returns {boolean} `true` if value is a valid finite number, `false` otherwise
 * @example
 * isNumber(0) // true
 * isNumber('0') // false
 * isNumber(Number.NaN) // false
 * isNumber(Number.POSITIVE_INFINITY) // false
 */
export const isNumber = (value: any): value is number =>
  typeof value === 'number'
  && !Number.isNaN(value)
  && Number.isFinite(value)
