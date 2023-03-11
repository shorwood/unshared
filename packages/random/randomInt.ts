/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Returns a cryptographically secure pseudorandom 32-bit number.
 * Falls back to Math.random() if `node:crypto` and `globalThis.crypto` is not available.
 *
 * @param allowUnsafe If `true`, falls back to Math.random() if `node:crypto` and `globalThis.crypto` is not available.
 * @returns A random number
 * @throws If `node:crypto` and `globalThis.crypto` is not available and `allowUnsafe` is `false`
 * @example
 * randomInt() // 1234567890
 */
export function randomInt(allowUnsafe?: boolean): number {
  // --- Use `globalThis.crypto` if available
  if (globalThis.crypto?.getRandomValues)
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0]

  // --- Fallback to `node:crypto` if available
  try {
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
