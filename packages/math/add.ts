/* eslint-disable spaced-comment */
/**
 * Add multiple numbers together.
 *
 * @param numbers The numbers to add.
 * @returns The sum of the numbers.
 * @example add(1, 2, 3) // 6
 * @see https://en.wikipedia.org/wiki/Addition
 */
export function add(...numbers: number[]): number {
  // --- Handle edge cases.
  if (numbers.length === 0) return 0
  if (numbers.length === 1) return numbers[0]
  if (numbers.some(number => Number.isNaN(number)))
    throw new Error('Cannot add NaN')

  // --- Compute the sum.
  let sum = 0
  for (const number of numbers) sum += number
  return sum
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should add numbers', () => {
    const result = add(1, 2, 3)
    expect(result).toEqual(6)
  })
}
