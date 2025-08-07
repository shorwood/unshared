import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomGumbelOptions extends RandomLCGNextOptions {

  /** The location parameter (μ). */
  location?: number

  /** The scale parameter (β > 0). */
  scale?: number
}

/**
 * Generate a random number with Gumbel distribution (Type-I Extreme Value distribution).
 * Uses the inverse transform method.
 *
 * @param options Options for the Gumbel distribution.
 * @returns A random number from the Gumbel distribution.
 * @example
 *
 * // Generate a random Gumbel number with location=0, scale=1.
 * const randomValue = randomGumbel({ location: 0, scale: 1 }); // Number from -∞ to +∞
 *
 * // Generate a random Gumbel number with custom seed.
 * const randomValue = randomGumbel.call(12345, { location: 2, scale: 0.5 }); // 2.345...
 */
export function randomGumbel(this: number | void, options: RandomGumbelOptions = {}): number {
  const { location = 0, scale = 1, onNextSeed } = options
  if (scale <= 0) throw new Error('Scale parameter must be greater than 0')
  const u = randomLcgNext.call(this, { onNextSeed })
  return location - scale * Math.log(-Math.log(u))
}
