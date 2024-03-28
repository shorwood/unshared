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
 * // Returns numbers as-is
 * toSafeNumber(5) // => 5
 */
export function toSafeNumber(n?: number): number {
  if (n === undefined) return 0
  if (Number.isNaN(n)) return 0
  if (n > Number.MAX_SAFE_INTEGER) return Number.MAX_SAFE_INTEGER
  if (n < Number.MIN_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER
  return n
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return zero when the value is undefined', () => {
    const result = toSafeNumber()
    expect(result).toEqual(0)
  })

  it('should return zero when the value is NaN', () => {
    const result = toSafeNumber(Number.NaN)
    expect(result).toEqual(0)
  })

  it('should return Number.MAX_SAFE_INTEGER when the value is greater than Number.MAX_SAFE_INTEGER', () => {
    const result = toSafeNumber(Number.MAX_SAFE_INTEGER + 1)
    expect(result).toEqual(Number.MAX_SAFE_INTEGER)
  })

  it('should return Number.MIN_SAFE_INTEGER when the value is less than Number.MIN_SAFE_INTEGER', () => {
    const result = toSafeNumber(Number.MIN_SAFE_INTEGER - 1)
    expect(result).toEqual(Number.MIN_SAFE_INTEGER)
  })

  it('should return numbers as is', () => {
    const result = toSafeNumber(5)
    expect(result).toEqual(5)
  })
}
