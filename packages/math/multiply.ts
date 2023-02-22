/**
 * Multiplies numbers.
 *
 * @param a The first number.
 * @param b The second number.
 * @returns The product of the numbers.
 * @example multiply(2, 2) // returns 4
 */
export function multiply(a: number, b: number): number {
  if (typeof a !== 'number')
    throw new TypeError('Expected a number')
  if (typeof b !== 'number')
    throw new TypeError('Expected a number')

  // --- Multiply the numbers.
  return a * b
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should multiply numbers', () => {
    const result = multiply(2, 2)
    expect(result).toEqual(4)
  })

  it('should throw if a is not a number', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => multiply('2', 2)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if b is not a number', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => multiply(2, '2')
    expect(shouldThrow).toThrow(TypeError)
  })
}
