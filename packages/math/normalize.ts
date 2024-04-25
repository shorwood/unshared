/**
 * Normalize a number from a given range to a range of 0-1. If the number is outside
 * the given range, it will be clamped to 0 or 1.
 *
 * Normalizing a number means to convert it to a value between 0 and 1. This is
 * useful for converting a number from one range to another. For example, if you
 * have a number between 0 and 100, you can normalize it to a value between 0 and
 * 1 by calling `normalize(50, 0, 100)`. The result will be 0.5.
 *
 * @param n The number to normalize.
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns The normalized number (0-1).
 */
export function normalize(n: number, min: number, max: number): number {
  if (min === max) return 1
  if (n <= min) return 0
  if (n >= max) return 1
  return (n - min) / (max - min)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should normalize a number to a given range', () => {
    const result = normalize(5, 0, 10)
    expect(result).toStrictEqual(0.5)
  })

  test('should normalize a number to a given range with negative numbers', () => {
    const result = normalize(0, -10, 10)
    expect(result).toStrictEqual(0.5)
  })

  test('should normalize and clamp max values', () => {
    const result = normalize(15, 0, 10)
    expect(result).toBe(1)
  })

  test('should normalize and clamp min values', () => {
    const result = normalize(-5, 0, 10)
    expect(result).toBe(0)
  })
}
