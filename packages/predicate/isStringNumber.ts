/**
 * Check if the string represents a number
 *
 * @param value The value to check
 * @returns `true` if the string represents a number, `false` otherwise
 * @example
 * isStringNumber('1') // true
 * isStringNumber('-1.0') // true
 * isStringNumber('1n') // false
 */
export const isStringNumber = (value: string): value is `${number}` =>
  typeof value === 'string'
  && /^-?\d+(\.\d+)?$/.test(value)
