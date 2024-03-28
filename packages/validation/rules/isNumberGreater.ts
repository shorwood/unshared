/**
 * Check if value is greater than n
 *
 * @param value The value to check
 * @param n The number to compare
 * @returns `true` if value is greater than n, `false` otherwise
 * @example
 * isNumberGreater(2, 0) // true
 * isNumberGreater(2, 2) // false
 * isNumberGreater(2, 4) // false
 */
export function isNumberGreater(value: number, n: number): boolean {
  return typeof value === 'number'
  && typeof n === 'number'
  && value > n
}
