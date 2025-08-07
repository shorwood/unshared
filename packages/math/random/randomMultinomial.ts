/* eslint-disable sonarjs/pseudo-random */
import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomMultinomialOptions extends RandomLCGNextOptions {

  /** The number of trials (n >= 0). */
  trials?: number

  /** The probability vector (sum must equal 1). */
  probabilities?: number[]
}

/**
 * Generate a random vector with multinomial distribution.
 * Uses sequential binomial sampling method.
 *
 * @param options Options for the multinomial distribution.
 * @returns A random vector from the multinomial distribution.
 * @example
 *
 * // Generate a random multinomial vector with 10 trials and equal probabilities.
 * const randomValue = randomMultinomial({ trials: 10, probabilities: [0.25, 0.25, 0.25, 0.25] }); // [2, 3, 2, 3]
 *
 * // Generate a random multinomial vector with custom seed.
 * const randomValue = randomMultinomial.call(12345, { trials: 20, probabilities: [0.3, 0.4, 0.3] }); // [6, 8, 6]
 */
export function randomMultinomial(this: number | void, options: RandomMultinomialOptions = {}): number[] {
  const { trials = 10, probabilities = [0.5, 0.5], onNextSeed } = options

  // --- Assert valid parameters
  if (trials < 0 || !Number.isInteger(trials))
    throw new Error('Number of trials must be a non-negative integer')
  if (probabilities.length === 0)
    throw new Error('Probabilities array cannot be empty')
  if (probabilities.some(p => p < 0 || p > 1))
    throw new Error('All probabilities must be between 0 and 1')

  const probabilitySum = probabilities.reduce((sum, p) => sum + p, 0)
  if (Math.abs(probabilitySum - 1) > 1e-10)
    throw new Error('Probabilities must sum to 1')

  // --- Use sequential binomial sampling
  const result = Array.from({ length: probabilities.length }, () => 0)
  let remainingTrials = trials
  let remainingProbability = 1
  let nextSeed = this ?? Math.random()

  for (let i = 0; i < probabilities.length - 1; i++) {
    if (remainingTrials === 0) break
    const p = probabilities[i] / remainingProbability
    let successes = 0

    // --- Generate binomial random variable for current category
    for (let trial = 0; trial < remainingTrials; trial++) {
      const u = randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
      if (u < p) successes++
    }

    result[i] = successes
    remainingTrials -= successes
    remainingProbability -= probabilities[i]
  }

  // --- Assign remaining trials to last category
  result[probabilities.length - 1] = remainingTrials
  if (onNextSeed) onNextSeed(nextSeed)
  return result
}
