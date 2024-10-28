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
