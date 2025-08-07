import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomWeibullOptions extends RandomLCGNextOptions {

  /** The shape parameter (k > 0). */
  shape?: number

  /** The scale parameter (λ > 0). */
  scale?: number
}

/**
 * Generate a random number with Weibull distribution.
 *
 * @param options Options for the Weibull distribution.
 * @returns A random number from the Weibull distribution.
 * @example
 *
 * // Generate a random Weibull number with shape=1, scale=1.
 * const randomValue = randomWeibull({ shape: 1, scale: 1 }); // Number >= 0
 *
 * // Generate a random Weibull number with custom seed.
 * const randomValue = randomWeibull.call(12345, { shape: 2, scale: 3 }); // 1.23...
 */
export function randomWeibull(this: number | void, options: RandomWeibullOptions = {}): number {
  const { shape = 1, scale = 1, onNextSeed } = options
  if (shape <= 0 || scale <= 0) throw new Error('Shape and scale parameters must be greater than 0')
  const random = randomLcgNext.call(this, { onNextSeed })
  return scale * Math.pow(-Math.log(1 - random), 1 / shape)
}
