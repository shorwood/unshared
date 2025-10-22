import type { RandomLCGNextOptions } from './randomLcgNext'
import { randomLcgNext } from './randomLcgNext'

export interface RandomHypergeometricOptions extends RandomLCGNextOptions {

  /** Population size (N > 0). */
  populationSize?: number

  /** Number of success states in population (K ≥ 0, K ≤ N). */
  successStates?: number

  /** Number of draws/samples (n ≥ 0, n ≤ N). */
  draws?: number
}

// --- Helper function to calculate combinations C(n,k)
function combination(n: number, k: number): number {
  if (k > n || k < 0) return 0
  if (k === 0 || k === n) return 1
  k = Math.min(k, n - k) // Take advantage of symmetry
  let result = 1
  for (let i = 0; i < k; i++) result = result * (n - i) / (i + 1)
  return result
}

/**
 * Generate a random integer with hypergeometric distribution.
 * Uses the inverse transform method with cumulative probability calculation.
 *
 * @param options Options for the hypergeometric distribution.
 * @returns A random integer from the hypergeometric distribution.
 * @example
 *
 * // Generate a random hypergeometric number (drawing 10 items from population of 50 with 20 successes).
 * const randomValue = randomHypergeometric({ populationSize: 50, successStates: 20, draws: 10 }); // Integer between 0 and 10
 *
 * // Generate a random hypergeometric number with custom seed.
 * const randomValue = randomHypergeometric.call(12345, { populationSize: 100, successStates: 30, draws: 15 }); // 4
 */
export function randomHypergeometric(this: number | void, options: RandomHypergeometricOptions = {}): number {
  const {
    populationSize = 50,
    successStates = 20,
    draws = 10,
    onNextSeed,
  } = options

  // --- Assert valid parameters
  if (populationSize <= 0 || !Number.isInteger(populationSize))
    throw new Error('Population size must be a positive integer')
  if (successStates < 0 || successStates > populationSize || !Number.isInteger(successStates))
    throw new Error('Success states must be a non-negative integer not greater than population size')
  if (draws < 0 || draws > populationSize || !Number.isInteger(draws))
    throw new Error('Number of draws must be a non-negative integer not greater than population size')
  const u = randomLcgNext.call(this, { onNextSeed })

  // --- Calculate hypergeometric probabilities and find the value
  const maxK = Math.min(draws, successStates)
  const minK = Math.max(0, draws - (populationSize - successStates))
  let cumulativeProb = 0
  for (let k = minK; k <= maxK; k++) {
    // P(X = k) = C(K,k) * C(N-K,n-k) / C(N,n)
    const numerator = combination(successStates, k) * combination(populationSize - successStates, draws - k)
    const denominator = combination(populationSize, draws)
    const prob = numerator / denominator
    cumulativeProb += prob
    if (u <= cumulativeProb) return k
  }

  // --- If we reach here, return the maximum k found.
  return maxK
}
