/**
 * Check if the string represents an integer number
 * @param {string} value The value to check
 * @returns {boolean} `true` if the string represents an integer number, `false` otherwise
 * @example
 * isStringInteger('1') // true
 * isStringInteger('1.0') // false
 * isStringInteger('1n') // false
 */
export const isStringInteger = (value: string): boolean =>
  typeof value === 'string'
  && /^-?\d+$/.test(value)
