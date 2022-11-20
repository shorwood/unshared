import { randomInt } from './randomInt'

/**
 * Returns a cryptographically secure pseudorandom float.
 * @param min The minimum value (default: `0`)
 * @param max The maximum value (default: `1`)
 * @return A random float between `min` and `max`
 */
export const randomFloat = (min = 0, max = 1): number => {
  const random = randomInt()
  const randomFloat = random / 0xFFFFFFFF
  return min + (max - min) * randomFloat
}
