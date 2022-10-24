import { random } from './random'

/**
 * Returns a cryptographically secure pseudorandom float.
 * @param min The minimum value
 * @param max The maximum value
 * @return A random float
 */
export const randomFloat = (min = 0, max = 1): number => {
  const randomInt = random()
  const randomFloat = randomInt / 0xFFFFFFFF
  return min + (max - min) * randomFloat
}
