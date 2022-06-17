/**
 * Compute Fibonacci number at N non recursively)
 * @param {number} n The number to calculate
 * @returns {number} The Fibonacci number at position N
 */
export const fibonacci = (n: number): number => {
  // --- Handle edge and common cases.
  if (n < 0) throw new Error('Fibonacci only defined for non-negative integers')
  if (n === 0) return 0
  if (n === 1) return 1

  // --- Define two big integers
  let a = BigInt(0)
  let b = BigInt(1)
  let c = BigInt(0)

  // --- Loop N times
  for (let index = 2; index <= n; index++) {
    c = a + b
    a = b
    b = c
  }

  // --- Return result as number
  return Number(c)
}
