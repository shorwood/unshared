import { NumberIntegerPositive } from '@unshared/types'

/**
 * Compute [Fibonacci number](https://en.wikipedia.org/wiki/Fibonacci_number) at index `n`.
 *
 * The Fibonacci sequence is defined by the recurrence relation: `F(n) = F(n-1) + F(n-2)`.
 * It is a sequence of numbers where each number is the sum of the two preceding ones.
 * The first two numbers in the sequence are 0 and 1.
 *
 * @param n The number to calculate
 * @returns The Fibonacci number at position N
 * @example fibonacci(10) // 55
 */
export function fibonacci<N extends number>(n: NumberIntegerPositive<N> | 0): number {
  let a = 0n
  let b = 1n
  let c = 0n
  for (let index = 2; index <= n; index++) {
    c = a + b
    a = b
    b = c
  }
  return Number(c)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute Fibonacci number at 0', () => {
    const result = fibonacci(0)
    expect(result).toEqual(0)
  })

  it('should compute Fibonacci number at N', () => {
    const result = fibonacci(50)
    expect(result).toEqual(12586269025)
  })

  it('should highlight invalid input when the argument is negative', () => {
    // @ts-expect-error: Test negative number
    fibonacci(-1)
  })

  it('should highlight invalid input when the argument is not an integer', () => {
    // @ts-expect-error: Test non-integer number
    fibonacci(1.5)
  })
}
