/**
 * Returns the [median](https://en.wikipedia.org/wiki/Median) of the given numbers.
 *
 * The median is the middle number of a sorted set of numbers. If the set has an
 * even number of numbers, the median is the average of the two middle numbers.
 *
 * @param numbers The numbers to compute the median of.
 * @returns The median of the given numbers.
 * @example median(1, 2, 3) // 2
 */
export function median(...numbers: number[]): number {
  const sorted = numbers.toSorted((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should compute the median of a set of odd numbers', () => {
    const result = median(50, 10, 10)
    expect(result).toBe(10)
  })

  test('should compute the median of a set of even numbers', () => {
    const result = median(50, 10, 10, 20)
    expect(result).toBe(15)
  })
}
