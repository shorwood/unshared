import { factorial } from './factorial'

/**
 * Computes the value of the [Bernstein polynomial](https://en.wikipedia.org/wiki/Bernstein_polynomial)
 * of degree `n` at position `t`.
 *
 * @param n The degree of the Bernstein polynomial.
 * @param t The position at which to evaluate the Bernstein polynomial. (From 0 to 1)
 * @returns The value of the Bernstein polynomial at position t.
 * @example bernstein(3, 0.5) // 0.375
 */
export function bernstein(n: number, t: number): number {
  if (t < 0 || t > 1) throw new RangeError('Expected t to be between 0 and 1')
  const a = factorial(n)
  const b = factorial(t)
  const c = factorial(n - t)
  return a / (b * c)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the bernstein polynomial of degree 3 at position 0.5', () => {
    const result = bernstein(3, 0.5)
    expect(result).toEqual(0.375)
  })

  it('should throw an error if t is less than 0', () => {
    const shouldThrow = () => bernstein(3, -1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw an error if t is greater than 1', () => {
    const shouldThrow = () => bernstein(3, 2)
    expect(shouldThrow).toThrow(RangeError)
  })
}
