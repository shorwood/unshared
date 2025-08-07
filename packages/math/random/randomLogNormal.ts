import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomGaussian } from './randomGaussian'

export interface RandomLogNormalOptions extends RandomLCGNextOptions {

  /** The mean of the underlying normal distribution. */
  mu?: number

  /** The standard deviation of the underlying normal distribution. */
  sigma?: number
}

/**
 * Generate a random number with log-normal distribution.
 *
 * @param options Options for the log-normal distribution.
 * @returns A random number from the log-normal distribution.
 * @example
 *
 * // Generate a random log-normal number with mu=0, sigma=1.
 * const randomValue = randomLogNormal({ mu: 0, sigma: 1 }); // Number > 0
 *
 * // Generate a random log-normal number with custom seed.
 * const randomValue = randomLogNormal.call(12345, { mu: 1, sigma: 0.5 }); // 2.34...
 */
export function randomLogNormal(this: number | void, options: RandomLogNormalOptions = {}): number {
  const { mu = 0, sigma = 1, onNextSeed } = options
  if (sigma <= 0) throw new Error('Sigma must be greater than 0')
  const random = randomGaussian.call(this, { mean: mu, standardDeviation: sigma, onNextSeed })
  return Math.exp(random)
}
