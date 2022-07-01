/* eslint-disable @typescript-eslint/consistent-type-imports */
import { requireSafe } from '../misc/requireSafe'
import { isNode } from '../environment/runtime'

/**
 * Returns a cryptographically secure pseudorandom 32-bit number.
 * @returns {number} A random number
 */
export const random = (): number => {
  if (isNode) return requireSafe('node:crypto')?.randomBytes(4).readUint32LE(0)
  return globalThis.crypto.getRandomValues(new Uint32Array(1))[0]
}

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

/**
 * Generate a random string of `n` length
 * @param {number} [n] length of the string
 * @param {string} [chars] characters to use in the string
 */
export const randomString = (n = 16, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string => {
  let result = ''

  // --- Generate the string
  for (let index = 0; index < n; index++) {
    const char = Math.trunc(randomFloat(0, chars.length))
    result += chars[char]
  }

  // --- Return the string
  return result
}
