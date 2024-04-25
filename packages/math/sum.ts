/**
 * Add two numbers.
 *
 * @param numbers The numbers to add.
 * @returns The sum of the numbers.
 * @example sum(2, 2, 2) // 6
 */
export function sum(...numbers: number[]): number {
  let result = 0
  for (const number of numbers) result += number
  return result
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should give the sum of 3 numbers', () => {
    const result = sum(2, 2, 2)
    expect(result).toBe(6)
  })

  test('should give the sum of 1 number', () => {
    const result = sum(2)
    expect(result).toBe(2)
  })

  test('should return 0 when no numbers are provided', () => {
    const result = sum()
    expect(result).toBe(0)
  })
}
