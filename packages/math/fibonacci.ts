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
export function fibonacci<N extends number>(n: 0 | NumberIntegerPositive<N>): number {

  // --- Handle edge cases.
  if (Number.isSafeInteger(n) === false) throw new TypeError('Cannot calculate Fibonacci number at non-integer index')
  if (n < 0) throw new RangeError('Cannot calculate Fibonacci number at negative index')

  // --- Return early for first two numbers.
  if (n === 0) return 0
  if (n === 1) return 1

  // --- Compute Fibonacci number using bigint.
  let a = 0n
  let b = 1n
  let c = 0n
  for (let index = 2; index <= n; index++) {
    c = a + b
    a = b
    b = c
  }

  // --- Cast bigint to number and return.
  return Number(c)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should compute Fibonacci number at 0', () => {
    const result = fibonacci(0)
    expect(result).toBe(0)
  })

  test('should compute Fibonacci number at 1', () => {
    const result = fibonacci(1)
    expect(result).toBe(1)
  })

  test('should compute Fibonacci number at N', () => {
    const result = fibonacci(50)
    expect(result).toBe(12586269025)
  })

  test('should throw when the argument is negative', () => {

    // @ts-expect-error: Test negative number
    const shouldThrow = () => fibonacci(-1)
    expect(shouldThrow).toThrow('Cannot calculate Fibonacci number at negative index')
  })

  test('should throw when the argument is not an integer', () => {

    // @ts-expect-error: Test non-integer number
    const shouldThrow = () => fibonacci(1.5)
    expect(shouldThrow).toThrow('Cannot calculate Fibonacci number at non-integer index')
  })

  test('should throw when the argument is not a safe integer', () => {
    const shouldThrow = () => fibonacci(Number.MAX_SAFE_INTEGER + 1)
    expect(shouldThrow).toThrow('Cannot calculate Fibonacci number at non-integer index')
  })
}
