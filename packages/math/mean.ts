/**
 * Returns the mean of the given numbers.
 *
 * @param numbers The numbers to calculate the mean of.
 * @returns The mean of the numbers.
 * @example mean(1, 2, 3) // 2
 * @see https://en.wikipedia.org/wiki/Mean
 */
export function mean(...numbers: number[]): number {
  let mean = 0
  for (const number of numbers) mean += number
  return mean / numbers.length
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the mean of numbers', () => {
    const result = mean(4, 36, 45, 50, 75)
    expect(result).toEqual(42)
  })
}
