import { randomInt } from './randomInt'

export interface RandomStringOptions {
  /**
   * Characters to use in the string
   *
   * @default 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
   */
  characters?: string
  /**
   * Allow unsafe random number generation if `node:crypto` and `globalThis.crypto` is not available.
   *
   * @default false
   */
  allowUnsafe?: boolean
}

/**
 * Generate a random string of a specific length.
 *
 * @param length length of the string (default: `16`)
 * @param options The options to use.
 * @returns A random string.
 * @throws If `node:crypto` and `globalThis.crypto` is not available and `allowUnsafe` is `false`.
 * @example randomString(8, { characters: 'abc' }) // 'abababab'
 */
export function randomString(length?: number, options?: RandomStringOptions): string
/**
 * Generate a random string of a specific length.
 *
 * @param length length of the string (default: `16`)
 * @param characters characters to use in the string.
 * @returns A random string.
 * @throws If `node:crypto` and `globalThis.crypto` is not available and `allowUnsafe` is `false`.
 * @example randomString(8, 'abc') // 'abababab'
 */
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
    const char = randomInt(allowUnsafe) % characters.length
    result += characters[char]
  }

  // --- Return the string
  return result
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a random string with default options', () => {
    const result = randomString()
    expect(result).toMatch(/^[\dA-Za-z]{16$/)
  })

  it('should return a random string with custom length', () => {
    const result = randomString(8)
    expect(result).toMatch(/^[\dA-Za-z]{8}$/)
  })

  it('should return a random string with custom characters', () => {
    const result = randomString(8, '01')
    expect(result).toMatch(/^[01]{8}$/)
  })

  it('should return a random string with custom characters', () => {
    const result = randomString(8, { characters: '01' })
    expect(result).toMatch(/^[01]{8}$/)
  })
}
