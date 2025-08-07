/* eslint-disable sonarjs/pseudo-random */
import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomGaussian } from './randomGaussian'
import { randomLcgNext } from './randomLcgNext'

export interface RandomBinomialOptions extends RandomLCGNextOptions {

  /** The number of trials (n ≥ 0). */
  n?: number

  /** The probability of success (0 ≤ p ≤ 1). */
  p?: number
}

/**
 * Generate a random integer with binomial distribution.
 *
 * @param options Options for the binomial distribution.
 * @returns A random integer from the binomial distribution.
 * @example
 *
 * // Generate a random binomial number with n=10, p=0.5.
 * const randomValue = randomBinomial({ n: 10, p: 0.5 }); // Integer between 0 and 10
 *
 * // Generate a random binomial number with custom seed.
 * const randomValue = randomBinomial.call(12345, { n: 20, p: 0.3 }); // 6
 */
export function randomBinomial(this: number | void, options: RandomBinomialOptions = {}): number {
  const { n = 10, p = 0.5, onNextSeed } = options
  if (n < 0 || !Number.isInteger(n)) throw new Error('n must be a non-negative integer')
  if (p < 0 || p > 1) throw new Error('p must be between 0 and 1')
  if (n === 0 || p === 0) return 0
  if (p === 1) return n

  // --- For large n, use normal approximation
  if (n > 25) {
    const normal = randomGaussian.call(this, { mean: n * p, standardDeviation: Math.sqrt(n * p * (1 - p)), onNextSeed })
    return Math.max(0, Math.min(n, Math.round(normal)))
  }

  // --- Direct simulation for small `n`.
  let successes = 0
  let nextSeed = this ?? Math.random()
  // Initialize the nextSeed by calling randomLcgNext once
  randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
  for (let i = 0; i < n; i++) {
    const randomValue = randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
    if (randomValue < p) successes++
  }

  if (onNextSeed) onNextSeed(nextSeed)
  return successes
}
