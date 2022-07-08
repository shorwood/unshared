/**
 * Check if the string represents a positive number
 * @param {string} value The value to check
 * @returns {boolean} `true` if the string represents a positive number, `false` otherwise
 * @example
 * isStringNumberPositive('-1') // false
 * isStringNumberPositive('1.0') // true
 * isStringNumberPositive('1n') // false
 */
export const isStringNumberPositive = (value: string): value is `${number}` =>
  typeof value === 'string'
  && /^\d+(\.\d+)?$/.test(value)
