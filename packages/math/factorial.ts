import type { NumberIntegerPositive } from '@unshared/types'

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
export function factorial<N extends number>(n: 0 | NumberIntegerPositive<N>): number {
  if (n < 0) throw new RangeError('Expected a positive number')
  if (Number.isSafeInteger(n) === false) throw new RangeError('Expected an integer number')
  let result = 1
  for (let index = 1; index <= n; index++) result *= index
  return result
}
