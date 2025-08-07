import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomChiSquared } from './randomChiSquared'
import { randomGaussian } from './randomGaussian'

export interface RandomStudentTOptions extends RandomLCGNextOptions {

  /** The degrees of freedom (ν > 0). */
  degreesOfFreedom?: number
}

/**
 * Generate a random number with Student's t-distribution.
 *
 * @param options Options for the t-distribution.
 * @returns A random number from the t-distribution.
 * @example
 *
 * // Generate a random t-distribution number with 1 degree of freedom.
 * const randomValue = randomStudentT({ degreesOfFreedom: 1 }); // Number from -∞ to +∞
 *
 * // Generate a random t-distribution number with custom seed.
 * const randomValue = randomStudentT.call(12345, { degreesOfFreedom: 5 }); // 0.123...
 */
export function randomStudentT(this: number | void, options: RandomStudentTOptions = {}): number {
  const { degreesOfFreedom = 1, onNextSeed } = options
  if (degreesOfFreedom <= 0) throw new Error('Degrees of freedom must be greater than 0')
  let currentSeed = 0
  const z = randomGaussian.call(this, { onNextSeed: value => currentSeed = value })
  const chi2 = randomChiSquared.call(currentSeed, { degreesOfFreedom, onNextSeed })
  return z / Math.sqrt(chi2 / degreesOfFreedom)
}
