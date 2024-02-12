/**
 * Check if the string is as long or longer than length
 *
 * @param value The value to check
 * @param length The length to compare to
 * @returns `true` if the string is as long or longer than length, `false` otherwise
 * @example
 * isStringLongerOrEq('foo', 3) // true
 * isStringLongerOrEq('foobar', 3) // true
 */
export function isStringLongerOrEq(value: string, length: number): value is string {
  return typeof value === 'string'
  && typeof length === 'number'
  && value.length >= length
}
