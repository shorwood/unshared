import { RandomOptions, randomInt } from './randomInt'

export interface RandomStringOptions extends RandomOptions {
  /**
   * Pool of characters to use for generating the string.
   *
   * @default 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
   */
  characters?: string
}

const DEFAULT_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Generate a cryptographically random string of a given length using the
 * specified characters. If no characters are provided, it will use a default
 * set of characters that includes numbers, lowercase, and uppercase letters.
 *
 * @param length The length of the string to generate.
 * @param options The options for generating the random string.
 * @returns A random string of the specified length.
 * @example randomString(8, { characters: '01', allowUnsafe: true }) // '01010101'
 */
export function randomString(length = 16, options: RandomStringOptions = {}): string {
  const { characters = DEFAULT_CHARACTERS, allowUnsafe } = options
  let result = ''

  // --- Generate the string
  for (let index = 0; index < length; index++) {
    const char = randomInt({ allowUnsafe }) % characters.length
    result += characters[char]
  }

  return result
}

/** v8 ignore next */
if (import.meta.vitest) {
  it('should return a random string with default options', () => {
    const result = randomString()
    const every = [...result].every((c) => DEFAULT_CHARACTERS.includes(c))
    expect(every).toBe(true)
  })

  it('should return a random string with custom length', () => {
    const result = randomString(8)
    expect(result).toMatch(/^[\dA-Za-z]{8}$/)
  })

  it('should return a random string with custom characters', () => {
    const result = randomString(8, { characters: '01' })
    expect(result).toMatch(/^[01]{8}$/)
  })

  it('should pass the `allowUnsafe` option to `randomInt`', () => {
    vi.mock('./randomInt', () => ({ randomInt: vi.fn(() => 0) }))
    randomString(8, { allowUnsafe: true })
    expect(randomInt).toHaveBeenCalledWith({ allowUnsafe: true })
  })
}
