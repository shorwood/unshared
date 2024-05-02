/**
 * Check if value is a negative number
 *
 * @param value The value to check
 * @returns `true` if value is a negative number, `false` otherwise
 * @example
 * isNumberNegative(-1) // true
 * isNumberNegative(1) // false
 */
export function isNumberNegative(value: number): boolean {
  return typeof value === 'number'
    && value < 0
}
