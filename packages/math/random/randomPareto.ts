import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomParetoOptions extends RandomLCGNextOptions {

  /** The scale parameter (x_m > 0). */
  scale?: number

  /** The shape parameter (α > 0). */
  shape?: number
}

/**
 * Generate a random number with Pareto distribution.
 *
 * @param options Options for the Pareto distribution.
 * @returns A random number from the Pareto distribution.
 * @example
 *
 * // Generate a random Pareto number with scale=1, shape=1.
 * const randomValue = randomPareto({ scale: 1, shape: 1 }); // Number >= scale
 *
 * // Generate a random Pareto number with custom seed.
 * const randomValue = randomPareto.call(12345, { scale: 2, shape: 3 }); // 2.45...
 */
export function randomPareto(this: number | void, options: RandomParetoOptions = {}): number {
  const { scale = 1, shape = 1, onNextSeed } = options
  if (scale <= 0 || shape <= 0) throw new Error('Scale and shape parameters must be greater than 0')
  const random = randomLcgNext.call(this, { onNextSeed })
  return scale / Math.pow(1 - random, 1 / shape)
}
