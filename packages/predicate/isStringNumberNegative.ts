/**
 * Check if the string represents a negative number
 *
 * @param value The value to check
 * @returns `true` if the string represents a negative number, `false` otherwise
 * @example
 * isStringNumberNegative('1') // false
 * isStringNumberNegative('-1.0') // true
 * isStringNumberNegative('1n') // false
 */
export const isStringNumberNegative = (value: string): value is `${number}` =>
  typeof value === 'string'
  && /^-\d+(\.\d+)?$/.test(value)
