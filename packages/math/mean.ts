/**
 * Computes the [mean](https://en.wikipedia.org/wiki/Mean) of the given numbers.
 *
 * The mean is the sum of the numbers divided by the number of numbers. In other
 * words, it is the average of the numbers.
 *
 * @param numbers The numbers to compute the mean of.
 * @returns The mean of the numbers.
 * @example mean(10, 50, 75) // 45
 */
export function mean(...numbers: number[]): number {
  let result = 0
  for (const number of numbers) result += number
  return result / numbers.length
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the mean of a set of numbers', () => {
    const result = mean(10, 20, 30)
    expect(result).toEqual(20)
  })
}
