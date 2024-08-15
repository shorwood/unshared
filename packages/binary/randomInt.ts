/* eslint-disable n/no-unsupported-features/node-builtins */
export interface RandomOptions {

  /**
   * If neither `node:crypto` nor `globalThis.crypto` is available,
   * allow unsafe random number generation using `Math.random()`.
   * When working with sensitive data, it is recommended to leave
   * this option as `false` to raise an error when no secure
   * random number generator is available.
   *
   * @default false
   */
  allowUnsafe?: boolean
}

/**
 * Returns a cryptographically secure pseudo-random 32-bit number.
 *
 * @param options The options for generating a random number.
 * Allow unsafe random number generation if neither `node:crypto`
 * nor `globalThis.crypto` is not available. This is not recommended
 * as it is not cryptographically secure.
 * @returns A cryptographically secure pseudo-random 32-bit number.
 * @example randomInt() // 1234567890
 */
export function randomInt(options: RandomOptions = {}): number {
  const { allowUnsafe = false } = options

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { randomInt } = require('node:crypto') as typeof import('node:crypto')
    return randomInt(0xFFFFFFFF)
  }

  // --- If not running in Node.js, fallback to `globalThis.crypto`.
  catch {
    if (globalThis.crypto?.getRandomValues) {
      const array = new Uint32Array(1)
      const values = globalThis.crypto.getRandomValues(array)
      return values[0]
    }

    // --- Throw if not allowed to use unsafe random number generation.
    if (!allowUnsafe) throw new Error('No cryptographically secure random number generator available')

    // --- Fallback to Math.random() if allowed.
    const random = Math.random()
    return Math.floor(random * 0xFFFFFFFF)
  }
}

/* v8 ignore start */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
if (import.meta.vitest) {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('should return a random unsigned 32-bit integer', () => {
    const result = randomInt()
    const isInteger = Number.isInteger(result)
    expect(isInteger).toBe(true)
    expect(result).not.toBeNaN()
    expect(result).toBeLessThanOrEqual(0xFFFFFFFF)
    expect(result).toBeGreaterThanOrEqual(0x00000000)
  })

  test('should fallback to `globalThis.crypto`', () => {
    require('node:crypto').randomInt = undefined
    vi.stubGlobal('crypto', { getRandomValues: vi.fn(() => new Uint32Array([0x7FFFFFFF])) })
    const result = randomInt()
    const isInteger = Number.isInteger(result)
    expect(isInteger).toBe(true)
    expect(result).toBe(0x7FFFFFFF)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(globalThis.crypto.getRandomValues).toHaveBeenCalledOnce()
  })

  test('should fallback to `Math.random()` if `allowUnsafe` is true', () => {
    require('node:crypto').randomInt = undefined
    vi.stubGlobal('crypto', { getRandomValues: undefined })
    vi.stubGlobal('Math', { floor: Math.floor, random: vi.fn(() => 0.5) })
    const result = randomInt({ allowUnsafe: true })
    const isInteger = Number.isInteger(result)
    expect(isInteger).toBe(true)
    expect(result).toBe(0x7FFFFFFF)
    expect(Math.random).toHaveBeenCalledOnce()
  })

  test('should throw if allowUnsafe is false and crypto is not available', () => {
    vi.stubGlobal('crypto', { randomInt: undefined })
    require('node:crypto').randomInt = undefined
    const shouldThrow = () => randomInt()
    expect(shouldThrow).toThrow('No cryptographically secure random number generator available')
  })
}
