/**
 * Substracts multiple numbers together.
 *
 * @param numbers The numbers to substract.
 * @returns The difference of the numbers.
 * @example substract(1, 2, 3) // -6
 */
export function substract(...numbers: [number, ...number[]]): number {
  let difference = 0
  for (const number of numbers) difference -= number
  return difference
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should substract numbers', () => {
    const result = substract(1, 2, 3)
    expect(result).toEqual(-6)
  })
}
