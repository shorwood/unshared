import { randomFloat } from './randomFloat'

/**
 * Generate a random string of `n` length
 * @param n length of the string
 * @param chars characters to use in the string
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
