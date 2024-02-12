/**
 * Transforms `n` to a safe number. This function is useful for collapsing numbers that
 * are out of range to a safe number. For example, `Number.POSITIVE_INFINITY` is collapsed
 * to `Number.MAX_VALUE` and `Number.NEGATIVE_INFINITY` is collapsed to `Number.MIN_VALUE`.
 * This function also collapses `Number.NaN` to `0`.
 *
 * @param n The number to transform to a safe number.
 * @returns The collapsed number.
 * @example
 * // Collapses Number.NaN to zero
 * toSafeNumber(Number.NaN) // => 0
 *
 * // Collapses undefined to zero
 * toSafeNumber(undefined) // => 0
 *
 * // Collapses `Number.POSITIVE_INFINITY` to `Number.MAX_VALUE`
 * toSafeNumber(Number.POSITIVE_INFINITY) // => 1.7976931348623157e+308
 *
 * // Collapses `Number.NEGATIVE_INFINITY` to `Number.MIN_VALUE`
 * toSafeNumber(Number.NEGATIVE_INFINITY) // => 5e-324
 *
 * // Does not collapse other numbers
 * toSafeNumber(5) // => 5
 */
export function toSafeNumber(n?: number): number {
  if (n === undefined) return 0
  if (Number.isNaN(n)) return 0
  if (n === Number.POSITIVE_INFINITY) return Number.MAX_VALUE
  if (n === Number.NEGATIVE_INFINITY) return Number.MIN_VALUE
  return n
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should collapse Number.NaN to zero', () => {
    const result = toSafeNumber(Number.NaN)
    expect(result).toEqual(0)
  })

  it('should collapse Number.POSITIVE_INFINITY to Number.MAX_VALUE', () => {
    const result = toSafeNumber(Number.POSITIVE_INFINITY)
    expect(result).toEqual(Number.MAX_VALUE)
  })

  it('should collapse Number.NEGATIVE_INFINITY to Number.MIN_VALUE', () => {
    const result = toSafeNumber(Number.NEGATIVE_INFINITY)
    expect(result).toEqual(Number.MIN_VALUE)
  })

  it('should not collapse other numbers', () => {
    const result = toSafeNumber(5)
    expect(result).toEqual(5)
  })
}
