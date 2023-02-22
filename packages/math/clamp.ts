import { bench } from 'vitest'

/**
 * Takes a number and clamps it between a minimum and a maximum value.
 *
 * @param n The number to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns The clamped value
 * @example clamp(100, 0, 10) // 10
 * @see https://en.wikipedia.org/wiki/Clamping_(graphics)
 */
export function clamp(n: number, min: number, max: number): number {
  if (n <= min) return min
  if (n >= max) return max
  return n
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should clamp a number between a minimum and a maximum value', () => {
    const result = clamp(-20, -10, 10)
    expect(result).toEqual(-10)
  })

  it('should clamp negative zero to a minimum value of positive zero', () => {
    const result = clamp(-0, 0, 10)
    expect(result).toEqual(0)
  })

  it('should clamp negative zero to a maximum value of positive zero', () => {
    const result = clamp(-0, -10, 0)
    expect(result).toEqual(0)
  })

  bench('should clamp a number between a minimum and a maximum value', () => {
    const result = clamp(-20, -10, 10)
    expect(result).toEqual(-10)
  })
}
