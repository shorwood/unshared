/**
 * Check if the string is as short or shorter than length
 *
 * @param value The value to check
 * @param length The length to compare to
 * @returns `true` if the string is as short or shorter than length, `false` otherwise
 * @example isStringShorterOrEqual('Hello, world!', 20) // true
 */
export function isStringShorterOrEqual(value: unknown, length: number): boolean {
  return typeof value === 'string' && value.length <= length
}
