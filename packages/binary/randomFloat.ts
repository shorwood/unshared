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
export function randomFloat(min = 0, max = 1, allowUnsafe?: boolean): number {
  const random = randomInt(allowUnsafe)
  const randomFloat = random / 0xFFFFFFFF
  return min + (max - min) * randomFloat
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('returns a random float between 0 and 1', () => {
    const result = randomFloat()
    expect(result).toBeTypeOf('number')
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(1)
    expect(Number.isInteger(result)).toEqual(false)
  })

  it('returns a random float between min and max', () => {
    const result = randomFloat(10, 20)
    expect(result).toBeTypeOf('number')
    expect(result).toBeGreaterThanOrEqual(10)
    expect(result).toBeLessThanOrEqual(20)
    expect(Number.isInteger(result)).toEqual(false)
  })
}
