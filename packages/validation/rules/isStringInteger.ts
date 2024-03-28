/**
 * Check if the string represents an integer number
 *
 * @param value The value to check
 * @returns `true` if the string represents an integer number, `false` otherwise
 * @example
 * isStringInteger('1') // true
 * isStringInteger('1.0') // false
 * isStringInteger('1n') // false
 */
export function isStringInteger(value: string): boolean {
  return typeof value === 'string'
  && /^-?\d+$/.test(value)
}
