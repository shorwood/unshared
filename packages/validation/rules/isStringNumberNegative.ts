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
export function isStringNumberNegative(value: string): value is `${number}` {
  return typeof value === 'string'
  && /^-\d+(\.\d+)?$/.test(value)
}
