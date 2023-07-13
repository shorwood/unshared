/**
 * Computes the [remainder](https://en.wikipedia.org/wiki/Modulo_operation) of the given numbers.
 *
 * The remainder is the number that remains after the division of the first number by a second number.
 *
 * @param numbers The numbers to compute the remainder of.
 * @returns The remainder of the numbers.
 * @example modulo(10, 3) // 1
 */
export function modulo(...numbers: number[]): number {
  let result = numbers.shift()
  for (const number of numbers) result %= number
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the remainder of a set of numbers', () => {
    const result = modulo(50, 10, 3)
    expect(result).toEqual(2)
  })
}
