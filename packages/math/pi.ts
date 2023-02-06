/**
 * Approximate pi with variable accuracy.
 * @param accuracy The accuracy to aim for
 * @return Approximated pi
 */
export const pi = (accuracy: number): number => {
  // --- Handle edge cases.
  if (accuracy < 0) throw new Error('Accuracy must be positive')

  // --- Initialize PI.
  let pi = 0

  // --- Loop
  for (let index = 0; index < accuracy; index++)
    pi += 4 * (-1) ** index / (2 * index + 1)

  // --- Return result as number
  return Number(pi)
}
