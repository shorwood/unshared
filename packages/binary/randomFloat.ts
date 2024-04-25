import { RandomOptions, randomInt } from './randomInt'

/**
 * Returns a cryptographically secure pseudorandom float.
 *
 * @param min The minimum value.
 * @param max The maximum value.
 * @param options The options for generating the random float.
 * @returns A random float between `min` and `max`
 * @example randomFloat(10, 20) // 15.123456789
 */
export function randomFloat(min = 0, max = 1, options?: RandomOptions): number {
  const random = randomInt(options)
  const randomFloat = random / 0xFFFFFFFF
  return min + (max - min) * randomFloat
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should return a random float between 0 and 1', () => {
    const result = randomFloat()
    expect(result).not.toBeNaN()
    expect(result).toBeTypeOf('number')
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(1)
    expect(Number.isInteger(result)).toBeFalsy()
  })

  test('should return a random float between min and max', () => {
    const result = randomFloat(10, 20)
    expect(result).toBeTypeOf('number')
    expect(result).toBeGreaterThanOrEqual(10)
    expect(result).toBeLessThanOrEqual(20)
    expect(Number.isInteger(result)).toBeFalsy()
  })
}
