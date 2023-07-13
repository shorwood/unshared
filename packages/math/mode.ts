/**
 * Computes the [mode](https://en.wikipedia.org/wiki/Mode_(statistics)) of multiple numbers.
 *
 * The mode is the number that occurs most frequently in a set of numbers.
 * If there are multiple modes, the smallest one is returned.
 *
 * @param numbers The numbers to compute the mode of.
 * @returns The mode of the numbers.
 * @example mode(10, 20, 30) // 10
 */
export function mode(...numbers: number[]): number {
  // --- Get the occurrences of each number.
  const counts: Record<number, number> = {}
  for (const number of numbers) {
    if (counts[number]) counts[number]++
    else counts[number] = 1
  }

  // --- Find the number with the most occurrences.
  let result = 0
  let maxCount = 0
  for (const number of numbers) {
    if (counts[number] > maxCount) {
      maxCount = counts[number]
      result = number
    }
  }

  // --- Return the number with the most occurrences.
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the mode of a set of numbers', () => {
    const result = mode(10, 10, 20, 30)
    expect(result).toEqual(10)
  })
}
