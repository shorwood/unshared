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

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the square root of a number', () => {
    const result = sqrt(9)
    expect(result).toEqual(3)
  })
}
