/* eslint-disable sonarjs/pseudo-random */
import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomVonMisesOptions extends RandomLCGNextOptions {

  /** The mean direction parameter (μ) in radians. */
  mean?: number

  /** The concentration parameter (κ >= 0). */
  concentration?: number
}

/**
 * Generate a random number with Von Mises distribution (Circular Normal distribution).
 * Uses Best and Fisher's algorithm for efficient generation.
 *
 * @param options Options for the Von Mises distribution.
 * @returns A random angle in radians from the Von Mises distribution.
 * @example
 *
 * // Generate a random Von Mises angle with mean=0, concentration=1.
 * const randomValue = randomVonMises({ mean: 0, concentration: 1 }); // Angle in radians
 *
 * // Generate a random Von Mises angle with custom seed.
 * const randomValue = randomVonMises.call(12345, { mean: Math.PI, concentration: 2 }); // 3.14...
 */
export function randomVonMises(this: number | void, options: RandomVonMisesOptions = {}): number {
  const { mean = 0, concentration = 1, onNextSeed } = options
  if (concentration < 0) throw new Error('Concentration parameter must be non-negative')
  if (concentration === 0) {
    const u = randomLcgNext.call(this, { onNextSeed })
    return mean + 2 * Math.PI * (u - 0.5)
  }

  // --- Use Best and Fisher's algorithm
  let nextSeed = this ?? Math.random()
  const a = 1 + Math.sqrt(1 + 4 * concentration * concentration)
  const b = (a - Math.sqrt(2 * a)) / (2 * concentration)
  const r = (1 + b * b) / (2 * b)

  while (true) {
    const u1 = randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
    const u2 = randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
    const z = Math.cos(Math.PI * u1)
    const f = (1 + r * z) / (r + z)
    const c = concentration * (r - f)

    if (c * (2 - c) - u2 > 0) {
      const u3 = randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
      const angle = Math.sign(u3 - 0.5) * Math.acos(f)
      if (onNextSeed) onNextSeed(nextSeed)
      return (mean + angle) % (2 * Math.PI)
    }

    if (Math.log(c / u2) + 1 - c >= 0) {
      const u3 = randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
      const angle = Math.sign(u3 - 0.5) * Math.acos(f)
      if (onNextSeed) onNextSeed(nextSeed)
      return (mean + angle) % (2 * Math.PI)
    }
  }
}
