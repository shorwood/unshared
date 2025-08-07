import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomUniformOptions extends RandomLCGNextOptions {

  /** The minimum value (inclusive). */
  min?: number

  /** The maximum value (exclusive). */
  max?: number
}

/**
 * Generate a random number with uniform distribution between min and max.
 * Uses a linear congruential generator for predictable, seeded randomness.
 *
 * @param options Options for the uniform distribution.
 * @returns A random number between min (inclusive) and max (exclusive).
 * @example
 *
 * // Generate a random number between 0 and 1.
 * const randomValue = randomUniform.call(12345, { min: 0, max: 1 }); // 0.09661652808693845
 *
 * // Generate a random number with custom range.
 * const randomValue = randomUniform.call(12345, { min: 10, max: 20 }); // 10.966165280869384
 *
 * // Create a seeded version of the function.
 * const seededRandomUniform = randomUniform.bind(12345); // Always returns same sequence
 */
export function randomUniform(this: number | void, options: RandomUniformOptions = {}): number {
  const { min = 0, max = 1, onNextSeed } = options
  const random = randomLcgNext.call(this, { onNextSeed })
  return random * (max - min) + min
}
