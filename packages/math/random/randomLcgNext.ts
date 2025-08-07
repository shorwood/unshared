/* eslint-disable sonarjs/pseudo-random */
export interface RandomLCGNextOptions {

  /** Optional callback to collect the next seed value. */
  onNextSeed?: (value: number) => void
}

/**
 * Generate the next random number in a sequence. This function uses a linear
 * congruential generator (LCG) algorithm and is used internally by other
 * random functions to produce a predictable sequence of pseudo-random numbers.
 *
 * @param options Optional options for the random number generation.
 * @returns A random number between 0 and 1.
 * @example
 * // Generate a random number using the given seed.
 * randomLcgNext.call(12345) // 0.09661652808693845
 *
 * // Collect the next seed value using the onNextSeed callback.
 * let seed = 12345
 * randomLcgNext.call(seed, { onNextSeed: value => seed = value })
 * console.log(seed) // 207482415
 */
export function randomLcgNext(this: number | void, options: RandomLCGNextOptions = {}): number {
  const seed = this ?? Math.random()
  if (typeof seed !== 'number') throw new TypeError('You must call randomLcgNext with a number as the context (this) value.')
  if (!Number.isFinite(seed)) throw new TypeError('You must call randomLcgNext with a finite number as the context (this) value.')
  let normalized = seed % 2147483647
  if (normalized <= 0) normalized += 2147483646
  const nextSeed = (normalized * 16807) % 2147483647
  if (options.onNextSeed) options.onNextSeed(nextSeed)
  return (nextSeed - 1) / 2147483646
}
