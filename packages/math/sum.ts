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
