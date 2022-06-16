/**
 * Approximate pi with variable accuracy.
 * @param {number} accuracy The accuracy to aim for
 * @returns {number} Approximated pi
 */
export const pi = (n: number): number => {
  let pi = 0
  let denom = 1
  let op = 1
  for (let index = 0; index < n; index++) {
    pi += op / denom
    denom += 2
    op *= -1
  }
  return 4 * pi
}
