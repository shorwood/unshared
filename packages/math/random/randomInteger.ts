import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomIntegerOptions extends RandomLCGNextOptions {

  /** The minimum value (inclusive). */
  min?: number

  /** The maximum value (inclusive). */
  max?: number
}

/**
 * Generate a random integer between min (inclusive) and max (inclusive).
 * Uses a linear congruential generator for predictable, seeded randomness.
 *
 * @param options Options for the integer generation.
 * @returns A random integer between min and max (both inclusive).
 * @example
 *
 * // Generate a random integer between 0 and 10.
 * const randomValue = randomInteger({ min: 0, max: 10 }); // Integer between 0 and 10
 *
 * // Generate a random integer with custom seed.
 * const randomValue = randomInteger.call(12345, { min: 0, max: 10 }); // 1
 */
export function randomInteger(this: number | void, options: RandomIntegerOptions = {}): number {
  const { min = 0, max = Number.MAX_SAFE_INTEGER, onNextSeed } = options
  if (!Number.isInteger(min)) throw new TypeError('min must be an integer')
  if (!Number.isInteger(max)) throw new TypeError('max must be an integer')
  if (min > max) throw new RangeError('min cannot be greater than max')
  const random = randomLcgNext.call(this, { onNextSeed })
  return Math.floor(random * (max - min + 1)) + min
}
