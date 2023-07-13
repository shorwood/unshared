/**
 * [Round](https://en.wikipedia.org/wiki/Rounding) a number to a specified number of decimal places.
 *
 * @param number The number to round.
 * @param precision The precision to round to.
 * @returns The rounded number.
 * @example round(1.2345, 2) // 1.23
 */
export function round(number: number, precision = 0): number {
  if (precision <= 0) return Math.round(number)
  const factor = 10 ** precision
  return Math.round(number * factor) / factor
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should round a number', () => {
    const result = round(1.2345)
    expect(result).toEqual(1)
  })

  it('should round a number to a specified number of decimal places', () => {
    const result = round(1.2345, 2)
    expect(result).toEqual(1.23)
  })
}
