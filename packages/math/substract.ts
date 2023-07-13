/**
 * Computes the [difference](https://en.wikipedia.org/wiki/Difference_(mathematics)) of multiple numbers.
 *
 * @param numbers The numbers to compute the difference of.
 * @returns The difference of the numbers.
 * @example substract(10, 2) // 8
 */
export function substract(...numbers: number[]): number {
  let result = numbers.shift()
  for (const number of numbers) result -= number
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should substract integers', () => {
    const result = substract(10, 5, 3)
    expect(result).toEqual(2)
  })
}
