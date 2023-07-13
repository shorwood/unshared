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
export function fibonacci(n: number): number {
  if (n < 0) throw new RangeError('Cannot compute Fibonacci number at negative index')

  // --- Define two big integers
  let a = 0n
  let b = 1n
  let c = 0n

  // --- Loop N times
  for (let index = 2; index <= n; index++) {
    c = a + b
    a = b
    b = c
  }

  // --- Return result as number
  return Number(c)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute Fibonacci number at N', () => {
    const result = fibonacci(50)
    expect(result).toEqual(12586269025)
  })

  it('should fail when N is negative', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const shouldThrow = () => fibonacci(-1)
    expect(shouldThrow).toThrowError(RangeError)
  })
}
