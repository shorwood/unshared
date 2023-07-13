/**
 * Computes the [power](https://en.wikipedia.org/wiki/Exponentiation) of a number.
 *
 * @param base The base number.
 * @param exponent The exponent number.
 * @returns The power of the numbers.
 * @example power(10, 2) // 100
 */
export function power(base: number, exponent: number): number {
  return base ** exponent
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the power of a number', () => {
    const result = power(10, 2)
    expect(result).toEqual(100)
  })
}
