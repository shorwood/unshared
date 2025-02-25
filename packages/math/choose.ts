/**
 * Returns the binomial coefficient “n choose k”
 *
 * @param n The number of items.
 * @param k The number of items to choose.
 * @returns The binomial coefficient.
 * @see https://blog.plover.com/math/choose.html
 */
export function choose(n: number, k: number): number {
  if (k > n) return 0
  if (k === 0) return 1
  let result = 1n
  for (let i = 1n; i <= BigInt(k); i++) {
    result *= BigInt(n) - i + 1n
    result /= i
  }
  return Number(result)
}
