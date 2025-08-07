/* eslint-disable sonarjs/pseudo-random */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable unicorn/no-this-assignment */
import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomGaussian } from './randomGaussian'
import { randomLcgNext } from './randomLcgNext'

export interface RandomGammaOptions extends RandomLCGNextOptions {

  /** The shape parameter (α > 0). */
  shape?: number

  /** The scale parameter (β > 0). */
  scale?: number
}

/**
 * Generate a random number with gamma distribution.
 * Uses the Marsaglia and Tsang method for shape >= 1, and transformation for shape < 1.
 *
 * @param options Options for the gamma distribution.
 * @returns A random number from the gamma distribution.
 * @example
 *
 * // Generate a random gamma number with default parameters.
 * const randomValue = randomGamma.call(12345); // 0.6838662302467584
 *
 * // Generate a random gamma number with custom parameters.
 * const randomValue = randomGamma.call(12345, { shape: 2, scale: 3 }); // 4.103797381480551
 *
 * // Create a seeded version of the function.
 * const seededRandomGamma = randomGamma.bind(12345); // Always returns same sequence
 */
export function randomGamma(this: number | void, options: RandomGammaOptions = {}): number {
  const { shape = 1, scale = 1, onNextSeed } = options
  if (shape <= 0 || scale <= 0) throw new Error('Shape and scale parameters must be greater than 0')

  // --- Handle case where shape < 1
  if (shape < 1) {
    let nextSeed = this
    // Use transformation: if X ~ Gamma(α + 1, β), then X * U^(1/α) ~ Gamma(α, β)
    const gammaResult = randomGamma.call(this, { shape: shape + 1, scale, onNextSeed: value => nextSeed = value })
    const u = randomLcgNext.call(nextSeed, { onNextSeed })
    return gammaResult * Math.pow(u, 1 / shape)
  }

  // --- Marsaglia and Tsang method
  const d = shape - 1 / 3
  const c = 1 / Math.sqrt(9 * d)
  let nextSeed = this ?? Math.random()

  // Add maximum iterations to prevent infinite loop
  const MAX_ITERATIONS = 1000
  let iterations = 0

  while (iterations < MAX_ITERATIONS) {
    iterations++
    let x: number
    let v: number
    let innerIterations = 0

    const MAX_INNER_ITERATIONS = 100
    do {
      innerIterations++
      x = randomGaussian.call(nextSeed, { onNextSeed: value => nextSeed = value })
      v = 1 + c * x
      if (innerIterations >= MAX_INNER_ITERATIONS) {
        // Break and use a default positive value
        v = 1
        break
      }
    } while (v <= 0)

    v = v * v * v
    const u = randomLcgNext.call(nextSeed, { onNextSeed: value => nextSeed = value })
    if (u < 1 - 0.0331 * x * x * x * x) {
      if (onNextSeed) onNextSeed(nextSeed)
      return d * v * scale
    }
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      if (onNextSeed) onNextSeed(nextSeed)
      return d * v * scale
    }
  }

  // Fallback if MAX_ITERATIONS is reached
  if (onNextSeed) onNextSeed(nextSeed)
  return d * scale // Return a default value as fallback
}
