/**
 * Check if the string is shorter than length
 *
 * @param value The value to check
 * @param length The length to compare to
 * @returns `true` if the string is shorter than length, `false` otherwise
 * @example isStringShorter('Hello, world!', 20) // true
 */
export function isStringShorter(value: unknown, length: number): boolean {
  return typeof value === 'string' && value.length < length
}
