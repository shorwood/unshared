/**
 * Check if the string represents a negative integer number
 *
 * @param value The value to check
 * @returns `true` if the string represents a negative integer number, `false` otherwise
 * @example
 * isStringIntegerNegative('1') // false
 * isStringIntegerNegative('-1') // true
 * isStringIntegerNegative('-1.0') // false
 */
export const isStringIntegerNegative = (value: string): boolean =>
  typeof value === 'string'
  && /^-\d+$/.test(value)
