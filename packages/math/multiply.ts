/**
 * Computes the [product](https://en.wikipedia.org/wiki/Product_(mathematics)) of the given numbers.
 *
 * @param numbers The numbers to compute the product of.
 * @returns The product of the numbers.
 * @example multiply(10, 2) // 20
 */
export function multiply(...numbers: number[]): number {
  let result = 1
  for (const number of numbers) result *= number
  return result
}
