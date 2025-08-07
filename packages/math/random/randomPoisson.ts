/* eslint-disable sonarjs/pseudo-random */
import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomGaussian } from './randomGaussian'
import { randomLcgNext } from './randomLcgNext'

export interface RandomPoissonOptions extends RandomLCGNextOptions {

  /** The rate parameter (λ > 0). */
  lambda?: number
}

/**
 * Generate a random integer with Poisson distribution.
 * Uses Knuth's algorithm for small lambda, and transformation method for large lambda.
 *
 * @param options Options for the Poisson distribution.
 * @returns A random integer from the Poisson distribution.
 * @example
 *
 * // Generate a random Poisson number with lambda=1.
 * const randomValue = randomPoisson({ lambda: 1 }); // Integer >= 0
 *
 * // Generate a random Poisson number with custom seed.
 * const randomValue = randomPoisson.call(12345, { lambda: 5 }); // 4
 */
export function randomPoisson(this: number | void, options: RandomPoissonOptions = {}): number {
  const { lambda = 1, onNextSeed } = options
  if (lambda <= 0) throw new Error('Lambda must be greater than 0')
  if (lambda < 30) {
    // Knuth's algorithm
    const L = Math.exp(-lambda)
    let k = 0
    let p = 1
    let nextSeed = this ?? Math.random()

    // --- Generate sequence until condition is met
    do {
      k++
      p *= randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
    } while (p > L)

    if (onNextSeed) onNextSeed(nextSeed)
    return k - 1
  }

  // --- Use normal approximation for large lambda
  const normal = randomGaussian.call(this, { mean: lambda, standardDeviation: Math.sqrt(lambda), onNextSeed })
  return Math.max(0, Math.round(normal))
}
