/**
 * Check if the string represents a negative number
 * @param {string} value The value to check
 * @returns {boolean} `true` if the string represents a negative number, `false` otherwise
 * @example
 * isStringNumberNegative('1') // false
 * isStringNumberNegative('-1.0') // true
 * isStringNumberNegative('1n') // false
 */
export const isStringNumberNegative = (value: string): value is `${number}` =>
  typeof value === 'string'
  && /^-\d+(\.\d+)?$/.test(value)
