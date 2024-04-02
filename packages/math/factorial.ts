import { NumberIntegerPositive } from '@unshared/types'

/**
 * Computes the [factorial](https://en.wikipedia.org/wiki/Factorial) of the given number.
 *
 * The factorial of a positive integer `n`, denoted by `n!`, is the product of all positive
 * integers less than or equal to `n`.
 *
 * @param n The number to calculate the factorial of.
 * @returns The factorial of the number.
 * @example factorial(5) // 120
 */
export function factorial<N extends number>(n: NumberIntegerPositive<N> | 0): number {
  if(n < 0) throw new RangeError('Expected a positive number')
  if(Number.isSafeInteger(n) === false) throw new RangeError('Expected an integer number')
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

  it('should highlight invalid input when the argument is negative', () => {
    // @ts-expect-error: Testing invalid input
    const shouldThrow = () => factorial(-1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should highlight invalid input when the argument is not an integer', () => {
    // @ts-expect-error: Testing invalid input
    const shouldThrow = () => factorial(1.5)
    expect(shouldThrow).toThrow(RangeError)
  })
}
