/**
 * Approximate pi with variable accuracy.
 *
 * @param accuracy The accuracy to aim for
 * @returns Approximated pi
 */
export const pi = (accuracy: number): number => {
  if (accuracy < 0) throw new RangeError('Cannot compute pi with negative accuracy')

  // --- Compute PI
  let pi = 0
  for (let index = 0; index < accuracy; index++)
    pi += 4 * (-1) ** index / (2 * index + 1)

  // --- Return result
  return pi
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should approximates pi with variable accuracy', () => {
    const result = pi(9)
    expect(result).toEqual(3.2523659347188767)
  })

  it('should fail when accuracy is negative', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const shouldThrow = () => pi(-1)
    expect(shouldThrow).toThrowError(RangeError)
  })
}
