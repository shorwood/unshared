/**
 * Computes the [percentile](https://en.wikipedia.org/wiki/Percentile) of the given numbers.
 *
 * The percentile is the value below which a given percentage of observations in
 * a group of observations falls. For example, the 20th percentile is the value
 * (or score) below which 20% of the observations may be found.
 *
 * @param numbers The numbers to compute the percentile of.
 * @param percentile The percentile to compute.
 * @returns The percentile of the numbers.
 * @example
 * const numbers = [10, 20, 30, 40, 50]
 * percentile(numbers, 0.25) // 20
 */
export function percentile(numbers: number[], percentile: number): number {
  const sorted = [...numbers].sort((a, b) => a - b)
  const index = (sorted.length - 1) * percentile
  const lower = Math.floor(index)
  const upper = lower + 1
  const weight = index % 1
  if (upper >= sorted.length) return sorted[lower]
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should compute the 25th percentile of a set of numbers', () => {
    const result = percentile([10, 20, 30, 40, 50], 0.25)
    expect(result).toBe(20)
  })

  test('should compute the 50th percentile of a set of numbers', () => {
    const result = percentile([10, 20, 30, 40, 50], 0.5)
    expect(result).toBe(30)
  })

  test('should compute the 75th percentile of a set of numbers', () => {
    const result = percentile([10, 20, 30, 40, 50], 0.75)
    expect(result).toBe(40)
  })
}
