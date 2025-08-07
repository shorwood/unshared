/* eslint-disable sonarjs/pseudo-random */
import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomZipfOptions extends RandomLCGNextOptions {

  /** The exponent parameter (s > 1). */
  exponent?: number

  /** The maximum value (N >= 1). */
  maxValue?: number
}

/**
 * Generate a random integer with Zipf distribution (power law distribution).
 * Uses rejection sampling method for efficient generation.
 *
 * @param options Options for the Zipf distribution.
 * @returns A random integer from the Zipf distribution.
 * @example
 *
 * // Generate a random Zipf number with exponent=2, maxValue=100.
 * const randomValue = randomZipf({ exponent: 2, maxValue: 100 }); // Integer between 1 and 100
 *
 * // Generate a random Zipf number with custom seed.
 * const randomValue = randomZipf.call(12345, { exponent: 1.5, maxValue: 1000 }); // 2
 */
export function randomZipf(this: number | void, options: RandomZipfOptions = {}): number {
  const { exponent = 2, maxValue = 100, onNextSeed } = options
  if (exponent <= 1) throw new Error('Exponent parameter must be greater than 1')
  if (maxValue < 1 || !Number.isInteger(maxValue)) throw new Error('Max value must be a positive integer')

  // --- Calculate normalization constant (Harmonic number)
  let harmonicSum = 0
  for (let k = 1; k <= maxValue; k++)
    harmonicSum += 1 / Math.pow(k, exponent)

  // --- Use rejection sampling for efficiency
  let nextSeed = this ?? Math.random()
  while (true) {
    const u = randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
    const k = Math.floor(maxValue * u) + 1
    const probability = (1 / Math.pow(k, exponent)) / harmonicSum
    const v = randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
    if (v <= probability) {
      if (onNextSeed) onNextSeed(nextSeed)
      return k
    }
  }
}
