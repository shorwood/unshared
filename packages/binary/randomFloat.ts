import { randomInt } from './randomInt'

/**
 * Returns a cryptographically secure pseudorandom float.
 *
 * @param min The minimum value (default: `0`)
 * @param max The maximum value (default: `1`)
 * @param allowUnsafe If `true`, falls back to Math.random() if `node:crypto` and `globalThis.crypto` is not available.
 * @returns A random float between `min` and `max`
 * @throws If `node:crypto` and `globalThis.crypto` is not available and `allowUnsafe` is `false`
 */
export const randomFloat = (min = 0, max = 1, allowUnsafe?: boolean): number => {
  const random = randomInt(allowUnsafe)
  const randomFloat = random / 0xFFFFFFFF
  return min + (max - min) * randomFloat
}
