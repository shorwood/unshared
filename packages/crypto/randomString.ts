import { randomFloat } from './randomFloat'

export interface RandomStringOptions {
  /** Characters to use in the string
   * @default 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
   */
  characters?: string
  /**
   * Allow unsafe random number generation if `node:crypto` and `globalThis.crypto` is not available.
   * @default false
   */
  allowUnsafe?: boolean
}

/**
 * Generate a random string of a specific length.
 * @param length length of the string (default: `16`)
 * @param charactersOrOptions characters to use in the string or options object
 * @return A random string
 * @throws If `node:crypto` and `globalThis.crypto` is not available and `allowUnsafe` is `false`
 * @example
 * randomString() // 'a1b2c3d4e5f6g7h8'
 */
export function randomString(length?: number, options?: RandomStringOptions): string
export function randomString(length?: number, characters?: string): string
export function randomString(length = 16, charactersOrOptions?: string | RandomStringOptions): string {
  let result = ''

  // --- Parse options
  if (typeof charactersOrOptions === 'string')
    charactersOrOptions = { characters: charactersOrOptions }

  // --- Destructure options
  const {
    characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    allowUnsafe = false,
  } = charactersOrOptions ?? {}

  // --- Generate the string
  for (let index = 0; index < length; index++) {
    const char = Math.trunc(randomFloat(0, characters.length, allowUnsafe))
    result += characters[char]
  }

  // --- Return the string
  return result
}
