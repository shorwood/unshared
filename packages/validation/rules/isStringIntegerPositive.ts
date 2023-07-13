/**
 * Check if the string represents a positive integer number
 *
 * @param value The value to check
 * @returns `true` if the string represents a positive integer number, `false` otherwise
 * @example
 * isStringIntegerPositive('1') // true
 * isStringIntegerPositive('-1') // false
 * isStringIntegerPositive('1.0') // false
 */
export const isStringIntegerPositive = (value: string): boolean =>
  typeof value === 'string'
  && /^\d+$/.test(value)
