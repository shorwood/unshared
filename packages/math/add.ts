import { toSafeNumber } from './toSafeNumber'

/**
 * Add two numbers.
 *
 * @param numbers The numbers to add.
 * @returns The sum of the numbers.
 * @example add(2, 2, 2) // 6
 */
export function add(...numbers: number[]): number {
  return numbers.reduce((sum, number) => sum + toSafeNumber(number), 0)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should add integers', () => {
    const result = add(2, 2, 2)
    expect(result).toEqual(4)
  })
}
