import { mean } from './mean'

/**
 * Computes the [variance](https://en.wikipedia.org/wiki/Variance) of multiple numbers.
 *
 * @param numbers The numbers to compute the variance of.
 * @returns The variance of the numbers.
 * @example variance(10, 20, 30) // 66.66666666666667
 */
export function variance(...numbers: number[]): number {
  const valuesMean = mean(...numbers)
  let result = 0
  for (const number of numbers) result += (number - valuesMean) ** 2
  return result / numbers.length
}
