/* eslint-disable no-compare-neg-zero */

/**
 * Takes a number and clamps it between a minimum and a maximum value.
 * @param {number} n The number to clamp
 * @param {number} min The minimum value
 * @param {number} max The maximum value
 * @returns {number} The clamped value
 */
export const clamp = (n: number, min: number, max: number): number => {
  if (n <= min) return min
  if (n >= max) return max
  return n
}
