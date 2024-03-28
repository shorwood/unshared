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
export function isStringIntegerNegative(value: string): boolean {
  return typeof value === 'string'
  && /^-\d+$/.test(value)
}
