import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomGamma } from './randomGamma'

export interface RandomBetaOptions extends RandomLCGNextOptions {

  /** The first shape parameter (α > 0). */
  alpha?: number

  /** The second shape parameter (β > 0). */
  beta?: number
}

/**
 * Generate a random number with beta distribution.
 *
 * @param options Options for the beta distribution.
 * @returns A random number from the beta distribution.
 * @example
 *
 * // Generate a random beta number with alpha=1 and beta=1.
 * const randomValue = randomBeta({ alpha: 1, beta: 1 }); // Number between 0 and 1
 *
 * // Generate a random beta number with custom seed.
 * const randomValue = randomBeta.call(12345, { alpha: 2, beta: 3 }); // 0.123...
 */
export function randomBeta(this: number | void, options: RandomBetaOptions = {}): number {
  const { alpha = 1, beta = 1, onNextSeed } = options
  if (alpha <= 0 || beta <= 0) throw new Error('Alpha and beta parameters must be greater than 0')
  let nextSeed = 0
  const x = randomGamma.call(this, { shape: alpha, scale: 1, onNextSeed: value => nextSeed = value })
  const y = randomGamma.call(nextSeed, { shape: beta, scale: 1, onNextSeed })
  return x / (x + y)
}
