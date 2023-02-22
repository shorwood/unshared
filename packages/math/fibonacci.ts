/**
 * Compute Fibonacci number at N non recursively)
 *
 * @param n The number to calculate
 * @returns The Fibonacci number at position N
 */
export function fibonacci(n: number): number {
  if (typeof n !== 'number') throw new TypeError('Expected a number')
  if (n < 0) throw new RangeError('Cannot compute Fibonacci number at negative index')
  if (n === 0) return 0
  if (n === 1) return 1

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
