/* oxlint-disable @typescript-eslint/no-this-alias */
/* oxlint-disable unicorn/no-this-assignment */
import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomGaussianOptions extends RandomLCGNextOptions {

  /** Optional mean value for the Gaussian distribution. */
  mean?: number

  /** Optional standard deviation for the Gaussian distribution. */
  standardDeviation?: number

  /** Optional spare Gaussian value for the Box-Muller transform. */
  gaussianSpare?: number | void

  /** Callback function to handle the spare Gaussian value. */
  onGaussianSpare?: (value: number | void) => void
}

/**
 * Generate a random number with normal (Gaussian) distribution.
 * Uses the Box-Muller transform.
 *
 * @param options Options for the Gaussian distribution.
 * @returns A random number from the normal distribution.
 * @example
 *
 * // Generate a random Gaussian number with mean 0 and standard deviation 1.
 * const randomValue = randomGaussian({ mean: 0, standardDeviation: 1 }); // Number between -∞ and +∞
 *
 * // Generate a random Gaussian number with a custom seed.
 * const randomValue = randomGaussian.call(12345, { mean: 0, standardDeviation: 1 }); // 0.0887431614553482
 */
export function randomGaussian(this: number | void, options: RandomGaussianOptions = {}): number {
  const {
    mean = 0,
    standardDeviation = 1,
    gaussianSpare,
    onGaussianSpare,
    onNextSeed,
  } = options

  // --- If a spare value is provided, use it directly. This allows for
  // --- generating two Gaussian values from one call to randomGaussian.
  // --- This can be useful for performance optimizations in some cases.
  if (gaussianSpare !== undefined) {
    const spare = gaussianSpare
    if (onGaussianSpare) onGaussianSpare()
    return spare * standardDeviation + mean
  }

  // --- Generate a new Gaussian value and send the spare value to the callback
  // --- so it can be used in the next call. This is part of the Box-Muller transform.
  let nextSeed = this
  const u1 = randomLcgNext.call(this, { onNextSeed: value => nextSeed = value })
  const u2 = randomLcgNext.call(nextSeed, { onNextSeed })
  const magnitude = Math.sqrt(-2 * Math.log(u1))
  const angle = 2 * Math.PI * u2
  if (onGaussianSpare) onGaussianSpare(magnitude * Math.sin(angle))
  return magnitude * Math.cos(angle) * standardDeviation + mean
}
