/**
 * Check if the string is as short or shorter than length
 *
 * @param value The value to check
 * @param length The length to compare to
 * @returns `true` if the string is as short or shorter than length, `false` otherwise
 * @example
 * isStringShorterOrEq('foo', 3) // true
 * isStringShorterOrEq('foobar', 3) // false
 */
export function isStringShorterOrEq(value: string, length: number): boolean {
  return typeof value === 'string'
  && typeof length === 'number'
  && value.length <= length
}
