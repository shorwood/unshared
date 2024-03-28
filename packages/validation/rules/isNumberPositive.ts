/**
 * Check if value is a positive number
 *
 * @param value The value to check
 * @returns `true` if value is a positive number, `false` otherwise
 * @example
 * isNumberPositive(1) // true
 * isNumberPositive(-1) // false
 */
export function isNumberPositive(value: number): boolean {
  return typeof value === 'number' && value >= 0
}
