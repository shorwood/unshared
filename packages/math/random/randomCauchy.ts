import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomCauchyOptions extends RandomLCGNextOptions {

  /** The location parameter (x₀). */
  location?: number

  /** The scale parameter (γ > 0). */
  scale?: number
}

/**
 * Generate a random number with Cauchy distribution.
 * Uses the inverse transform method.
 *
 * @param options Options for the Cauchy distribution.
 * @returns A random number from the Cauchy distribution.
 * @example
 *
 * // Generate a random Cauchy number with location=0, scale=1.
 * const randomValue = randomCauchy({ location: 0, scale: 1 }); // Number from -∞ to +∞
 *
 * // Generate a random Cauchy number with custom seed.
 * const randomValue = randomCauchy.call(12345, { location: 0, scale: 2 }); // 1.234...
 */
export function randomCauchy(this: number | void, options: RandomCauchyOptions = {}): number {
  const { location = 0, scale = 1, onNextSeed } = options
  if (scale <= 0) throw new Error('Scale parameter must be greater than 0')
  const u = randomLcgNext.call(this, { onNextSeed })
  return location + scale * Math.tan(Math.PI * (u - 0.5))
}
