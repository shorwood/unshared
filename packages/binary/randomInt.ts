/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Returns a cryptographically secure pseudorandom 32-bit number.
 *
 * @param [allowUnsafe]
 * Allow unsafe random number generation if neither `node:crypto`
 * nor `globalThis.crypto` is not available. This is not recommended
 * as it is not cryptographically secure.
 * @returns A cryptographically secure pseudorandom 32-bit number.
 * @example randomInt() // 1234567890
 */
export function randomInt(allowUnsafe = false): number {
  // --- Use `globalThis.crypto` if available
  if (globalThis.crypto?.getRandomValues) {
    const unsafeArray = new Uint32Array(16)
    return globalThis.crypto.getRandomValues(unsafeArray)[0]
  }

  // --- Fallback to `node:crypto` if available
  try {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const { randomBytes } = require('node:crypto') as typeof import('node:crypto')
    return randomBytes(4).readUint32LE(0)
  }

  // --- Fallback to Math.random() if allowed
  catch {
    if (!allowUnsafe) throw new Error('No cryptographically secure random number generator available')
    return Math.floor(Math.random() * 0xFFFFFFFF)
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('returns a random unsigned 32-bit integer', () => {
    const result = randomInt()
    expect(result).toBeTypeOf('number')
    expect(result).toBeGreaterThanOrEqual(0x00000000)
    expect(result).toBeLessThanOrEqual(0xFFFFFFFF)
    expect(Number.isInteger(result)).toEqual(true)
  })

  it('should fallback to `globalThis.crypto` if `node:crypto` is not available', () => {
    vi.stubGlobal('node:crypto', { getRandomValues: () => [0x12345678] })
    require('node:crypto').randomBytes = undefined
    const result = randomInt()
    expect(result).toBeTypeOf('number')
    expect(result).toBeGreaterThanOrEqual(0x00000000)
    expect(result).toBeLessThanOrEqual(0xFFFFFFFF)
    expect(Number.isInteger(result)).toEqual(true)
  })

  it('should return a random number if allowUnsafe is true and crypto is not available', () => {
    vi.stubGlobal('crypto', { getRandomValues: undefined })
    require('node:crypto').randomBytes = undefined
    expect(globalThis.crypto.getRandomValues).toBeUndefined()
    expect(require('node:crypto').randomBytes).toBeUndefined()
    const result = randomInt(true)
    expect(result).toBeTypeOf('number')
    expect(result).toBeGreaterThanOrEqual(0x00000000)
    expect(result).toBeLessThanOrEqual(0xFFFFFFFF)
    expect(Number.isInteger(result)).toEqual(true)
  })

  it('should throw if allowUnsafe is false and crypto is not available', () => {
    vi.stubGlobal('crypto', { getRandomValues: undefined })
    require('node:crypto').randomBytes = undefined
    expect(globalThis.crypto.getRandomValues).toBeUndefined()
    expect(require('node:crypto').randomBytes).toBeUndefined()
    const shouldThrow = () => randomInt()
    expect(shouldThrow).toThrow()
  })
}
