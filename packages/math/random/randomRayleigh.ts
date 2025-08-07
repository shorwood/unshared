import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomRayleighOptions extends RandomLCGNextOptions {

  /** The scale parameter (σ > 0). */
  scale?: number
}

/**
 * Generate a random number with Rayleigh distribution.
 * Uses the inverse transform method.
 *
 * @param options Options for the Rayleigh distribution.
 * @returns A random number from the Rayleigh distribution.
 * @example
 *
 * // Generate a random Rayleigh number with scale=1.
 * const randomValue = randomRayleigh({ scale: 1 }); // Number >= 0
 *
 * // Generate a random Rayleigh number with custom seed.
 * const randomValue = randomRayleigh.call(12345, { scale: 2 }); // 2.345...
 */
export function randomRayleigh(this: number | void, options: RandomRayleighOptions = {}): number {
  const { scale = 1, onNextSeed } = options

  // --- Assert valid parameters
  if (scale <= 0) throw new Error('Scale parameter must be greater than 0')

  const u = randomLcgNext.call(this, { onNextSeed })
  return scale * Math.sqrt(-2 * Math.log(u))
}
