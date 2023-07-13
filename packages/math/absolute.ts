/**
 * Returns the absolute value of a number.
 *
 * The absolute value of a number is the number itself if it is positive, or the
 * negative of the number if it is negative.
 *
 * @param n The number to get the absolute value of.
 * @returns The absolute value of the number.
 * @example absolute(-10) // 10
 */
export function absolute(n: number): number {
  return n < 0 ? -n : n
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return the absolute value of a positive number', () => {
    const result = absolute(10)
    expect(result).toEqual(10)
  })

  it('should return the absolute value of a negative number', () => {
    const result = absolute(-10)
    expect(result).toEqual(10)
  })
}
