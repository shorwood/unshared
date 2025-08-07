import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomChiSquared } from './randomChiSquared'

export interface RandomFDistributionOptions extends RandomLCGNextOptions {

  /** The first degrees of freedom. */
  d1?: number

  /** The second degrees of freedom. */
  d2?: number
}

/**
 * Generate a random number with F-distribution.
 *
 * @param options Options for the F-distribution.
 * @returns A random number from the F-distribution.
 * @example
 *
 * // Generate a random F-distribution number with d1=1, d2=1.
 * const randomValue = randomFDistribution({ d1: 1, d2: 1 }); // Number >= 0
 *
 * // Generate a random F-distribution number with custom seed.
 * const randomValue = randomFDistribution.call(12345, { d1: 5, d2: 10 }); // 0.123...
 */
export function randomFDistribution(this: number | void, options: RandomFDistributionOptions = {}): number {
  const { d1 = 1, d2 = 1, onNextSeed } = options
  if (d1 <= 0 || d2 <= 0) throw new Error('Degrees of freedom must be greater than 0')
  let currentSeed = 0
  const chi1 = randomChiSquared.call(this, { degreesOfFreedom: d1, onNextSeed: value => currentSeed = value })
  const chi2 = randomChiSquared.call(currentSeed, { degreesOfFreedom: d2, onNextSeed })
  return (chi1 / d1) / (chi2 / d2)
}
