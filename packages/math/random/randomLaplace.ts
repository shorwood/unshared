import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomLaplaceOptions extends RandomLCGNextOptions {

  /** The location parameter (μ). */
  location?: number

  /** The scale parameter (b > 0). */
  scale?: number
}

/**
 * Generate a random number with Laplace (double exponential) distribution.
 * Uses the inverse transform method.
 *
 * @param options Options for the Laplace distribution.
 * @returns A random number from the Laplace distribution.
 * @example
 *
 * // Generate a random Laplace number with location=0, scale=1.
 * const randomValue = randomLaplace({ location: 0, scale: 1 }); // Number from -∞ to +∞
 *
 * // Generate a random Laplace number with custom seed.
 * const randomValue = randomLaplace.call(12345, { location: 2, scale: 0.5 }); // 1.234...
 */
export function randomLaplace(this: number | void, options: RandomLaplaceOptions = {}): number {
  const { location = 0, scale = 1, onNextSeed } = options
  if (scale <= 0) throw new Error('Scale parameter must be greater than 0')
  const u = randomLcgNext.call(this, { onNextSeed })
  return u < 0.5
    ? location + scale * Math.log(2 * u)
    : location - scale * Math.log(2 * (1 - u))
}
