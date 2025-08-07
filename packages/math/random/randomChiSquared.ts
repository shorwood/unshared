import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomGamma } from './randomGamma'

export interface RandomChiSquaredOptions extends RandomLCGNextOptions {

  /** The degrees of freedom (k > 0). */
  degreesOfFreedom?: number
}

/**
 * Generate a random number with chi-squared distribution.
 *
 * @param options Options for the chi-squared distribution.
 * @returns A random number from the chi-squared distribution.
 * @example
 *
 * // Generate a random chi-squared number with 1 degree of freedom.
 * const randomValue = randomChiSquared({ degreesOfFreedom: 1 }); // Number >= 0
 *
 * // Generate a random chi-squared number with custom seed.
 * const randomValue = randomChiSquared.call(12345, { degreesOfFreedom: 5 }); // 3.45...
 */
export function randomChiSquared(this: number | void, options: RandomChiSquaredOptions = {}): number {
  const { degreesOfFreedom = 1, onNextSeed } = options
  if (degreesOfFreedom <= 0) throw new Error('Degrees of freedom must be greater than 0')
  return randomGamma.call(this, { shape: degreesOfFreedom / 2, scale: 2, onNextSeed })
}
