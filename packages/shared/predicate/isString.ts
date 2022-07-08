/**
 * Check if value is a string
 * @param {string} value The value to check
 * @returns {value is string} `true` if value is a string, `false` otherwise
 * @example
 * isString('foo') // true
 * isString(1) // false
 */
export const isString = (value: any): value is string =>
  typeof value === 'string'
