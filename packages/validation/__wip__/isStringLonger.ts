/**
 * Check if the string is longer than length
 *
 * @param value The value to check
 * @param length The length to compare to
 * @returns `true` if the string is longer than length, `false` otherwise
 * @example
 * isStringLonger('foo', 3) // false
 * isStringLonger('foobar', 3) // true
 */
export function isStringLonger(value: string, length: number): value is string {
  return typeof value === 'string'
    && typeof length === 'number'
    && value.length > length
}
