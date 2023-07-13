/**
 * [Floor](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions) a number to a given precision.
 *
 * @param number The number to floor.
 * @param precision The precision to floor to.
 * @returns The floored number.
 * @example floor(1.234, 2) // 1.23
 */
export function floor(number: number, precision = 0): number {
  if (precision <= 0) return Math.floor(number)
  const factor = 10 ** precision
  return Math.floor(number * factor) / factor
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should floor a number', () => {
    const result = floor(1.234)
    expect(result).toEqual(1)
  })

  it('should floor a number to a given precision', () => {
    const result = floor(1.234, 2)
    expect(result).toEqual(1.23)
  })
}
