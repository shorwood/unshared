/**
 * Computes the square root of a number.
 *
 * @param n The number to compute the square root of.
 * @returns The square root of the number.
 * @example sqrt(9) // 3
 */
export function sqrt(n: number): number {
  if (n < 0) throw new RangeError('Cannot compute square root of negative number')
  return Math.sqrt(n)
}
