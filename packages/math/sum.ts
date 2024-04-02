/**
 * Add two numbers.
 *
 * @param numbers The numbers to add.
 * @returns The sum of the numbers.
 * @example sum(2, 2, 2) // 6
 */
export function sum(...numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should give the sum of 3 numbers', () => {
    const result = sum(2, 2, 2)
    expect(result).toEqual(6)
  })

  it('should give the sum of 1 number', () => {
    const result = sum(2)
    expect(result).toEqual(2)
  })

  it('should return 0 when no numbers are provided', () => {
    const result = sum()
    expect(result).toEqual(0)
  })
}
