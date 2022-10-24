import { random } from './random'

/**
 * Returns a cryptographically secure pseudorandom float.
 * @param {number} [min] The minimum value
 * @param {number} [max] The maximum value
 * @returns {number} A random float
 */
export const randomFloat = (min = 0, max = 1): number => {
  const randomInt = random()
  const randomFloat = randomInt / 0xFFFFFFFF
  return min + (max - min) * randomFloat
}
