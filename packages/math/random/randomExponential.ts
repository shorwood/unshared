import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomExponentialOptions extends RandomLCGNextOptions {

  /** The rate parameter (λ > 0). */
  lambda?: number
}

/**
 * Generate a random number with exponential distribution.
 * Uses the inverse transform sampling method with a linear congruential generator.
 *
 * @param options Options for the exponential distribution.
 * @returns A random number from the exponential distribution.
 * @example
 *
 * // Generate a random exponential number with default rate parameter of 1.
 * const randomValue = randomExponential.call(12345); // 0.10186721353963925
 *
 * // Generate a random exponential number with custom rate parameter.
 * const randomValue = randomExponential.call(12345, { lambda: 2 }); // 0.050933606769819626
 *
 * // Create a seeded version of the function.
 * const seededRandomExponential = randomExponential.bind(12345); // Always returns same sequence
 */
export function randomExponential(this: number | void, options: RandomExponentialOptions = {}): number {
  const { lambda = 1, onNextSeed } = options
  if (lambda <= 0) throw new Error('Lambda must be greater than 0')
  const u = randomLcgNext.call(this, { onNextSeed })
  return -Math.log(1 - u) / lambda
}
