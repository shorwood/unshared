/**
 * [Ceil](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions) a number to a given precision.
 *
 * @param number The number to ceil.
 * @param precision The precision to ceil to. (Default: 0)
 * @returns The ceiled number.
 * @example ceil(1.234, 2) // 1.24
 */
export function ceil(number: number, precision = 0): number {
  if (precision <= 0) return Math.ceil(number)
  const factor = Math.pow(10, precision)
  return Math.ceil(number * factor) / factor
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should ceil a number', () => {
    const result = ceil(1.234)
    expect(result).toEqual(2)
  })

  it('should ceil a number to a given precision', () => {
    const result = ceil(1.234, 2)
    expect(result).toEqual(1.24)
  })
}
