/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param number The number to round.
 * @param decimals The number of decimal places to round to.
 * @returns The rounded number.
 * @example round(1.2345, 2) // 1.23
 * @see https://en.wikipedia.org/wiki/Rounding
 */
export function round(number: number, decimals = 0): number {
  // --- Handle edge cases.
  if (typeof number !== 'number') throw new TypeError('Number must be a number')
  if (!Number.isFinite(number)) throw new RangeError('Number must be finite')
  if (Number.isNaN(number)) throw new RangeError('Number must not be NaN')
  if (decimals < 0) throw new RangeError('Decimals must be greater than or equal to 0')
  if (decimals > 15) throw new RangeError('Decimals must be less than or equal to 15')
  if (decimals === 0) return Math.round(number)

  // --- Round the number.
  const factor = Math.pow(10, decimals)
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

  it('should throw an error if the number is not a number', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const shouldThrow = () => round('1.2345' as any)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the number is not finite', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const shouldThrow = () => round(Number.POSITIVE_INFINITY as any)
    expect(shouldThrow).toThrowError(RangeError)
  })

  it('should throw an error if the number is NaN', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const shouldThrow = () => round(Number.NaN as any)
    expect(shouldThrow).toThrowError(RangeError)
  })

  it('should throw an error if the decimals is less than 0', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const shouldThrow = () => round(1.2345, -1)
    expect(shouldThrow).toThrowError(RangeError)
  })

  it('should throw an error if the decimals is greater than 15', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const shouldThrow = () => round(1.2345, 16)
    expect(shouldThrow).toThrowError(RangeError)
  })
}
