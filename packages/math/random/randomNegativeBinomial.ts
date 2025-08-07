import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomGamma } from './randomGamma'
import { randomPoisson } from './randomPoisson'

export interface RandomNegativeBinomialOptions extends RandomLCGNextOptions {

  /** The number of failures (r > 0). */
  r?: number

  /** The probability of success (0 < p < 1). */
  p?: number
}

/**
 * Generate a random integer with negative binomial distribution.
 *
 * @param options Options for the negative binomial distribution.
 * @returns A random integer from the negative binomial distribution.
 * @example
 *
 * // Generate a random negative binomial number with r=1, p=0.5.
 * const randomValue = randomNegativeBinomial({ r: 1, p: 0.5 }); // Integer >= 0
 *
 * // Generate a random negative binomial number with custom seed.
 * const randomValue = randomNegativeBinomial.call(12345, { r: 2, p: 0.3 }); // 3
 */
export function randomNegativeBinomial(this: number | void, options: RandomNegativeBinomialOptions = {}): number {
  const { r = 1, p = 0.5, onNextSeed } = options
  if (r <= 0) throw new Error('r must be greater than 0')
  if (p <= 0 || p >= 1) throw new Error('p must be between 0 and 1 (exclusive)')
  let nextSeed = 0
  const gamma = randomGamma.call(this, { shape: r, scale: (1 - p) / p, onNextSeed: value => nextSeed = value })
  return randomPoisson.call(nextSeed, { lambda: gamma, onNextSeed })
}
