import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomGeometricOptions extends RandomLCGNextOptions {

  /** The probability of success (0 < p ≤ 1). */
  p?: number
}

/**
 * Generate a random integer with geometric distribution.
 *
 * @param options Options for the geometric distribution.
 * @returns A random integer from the geometric distribution.
 * @example
 *
 * // Generate a random geometric number with p=0.5.
 * const randomValue = randomGeometric({ p: 0.5 }); // Integer >= 1
 *
 * // Generate a random geometric number with custom seed.
 * const randomValue = randomGeometric.call(12345, { p: 0.3 }); // 2
 */
export function randomGeometric(this: number | void, options: RandomGeometricOptions = {}): number {
  const { p = 0.5, onNextSeed } = options
  if (p <= 0 || p > 1) throw new Error('p must be between 0 (exclusive) and 1 (inclusive)')
  const random = randomLcgNext.call(this, { onNextSeed })
  return Math.floor(Math.log(1 - random) / Math.log(1 - p)) + 1
}
