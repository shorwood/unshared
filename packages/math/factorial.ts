/**
 * Returns the factorial of a number.
 *
 * @param n The number to calculate the factorial of.
 * @returns The factorial of the number.
 * @example factorial(5) // 120
 * @see https://en.wikipedia.org/wiki/Factorial
 */
export function factorial(n: number): number {
  if (typeof n !== 'number')
    throw new TypeError('Expected a number')
  if (n < 0)
    throw new RangeError('Expected a positive number')

  // --- Compute the factorial.
  let result = 1
  for (let index = 1; index <= n; index++) result *= index
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the factorial of a 0', () => {
    const result = factorial(0)
    expect(result).toEqual(1)
  })

  it('should compute the factorial of a 5', () => {
    const result = factorial(5)
    expect(result).toEqual(120)
  })

  it('should throw an error if the argument is not a number', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => factorial('foo')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the argument is negative', () => {
    const shouldThrow = () => factorial(-1)
    expect(shouldThrow).toThrow(RangeError)
  })
}
