/**
 * Divide two numbers.
 *
 * @param a The first number.
 * @param b The second number.
 * @returns The quotient of the numbers.
 * @example divide(10, 50) // 0.2
 */
export function divide(a: number, b: number): number {
  return a / b
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should divide integers', () => {
    const result = divide(10, 20)
    expect(result).toEqual(0.5)
  })
}
