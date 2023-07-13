/**
 * Computes the [factorial](https://en.wikipedia.org/wiki/Factorial) of the given number.
 *
 * @param n The number to calculate the factorial of.
 * @returns The factorial of the number.
 * @example factorial(5) // 120
 */
export function factorial(n: number): number {
  if (n < 0) throw new RangeError('Cannot compute factorial of negative number')
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

  it('should throw an error if the argument is negative', () => {
    const shouldThrow = () => factorial(-1)
    expect(shouldThrow).toThrow(RangeError)
  })
}
