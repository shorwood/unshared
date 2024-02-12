/**
 * Compute the ceiling of a number at the given precision.
 *
 * @param n The number to ceil.
 * @param precision The precision to ceil to. (Default: 0)
 * @returns The ceiled number.
 * @example ceil(1.234, 2) // 1.24
 */
export function ceil(n: number, precision = 0): number {
  if (precision <= 0) return Math.ceil(n)
  const factor = Math.pow(10, precision)
  return Math.ceil(n * factor) / factor
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
