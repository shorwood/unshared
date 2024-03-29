/**
 * [Clamps](https://en.wikipedia.org/wiki/Clamping_(graphics)) a number to a given range.
 *
 * Clamping a number means to limit it to a given range. If the number is smallerthan
 * the minimum value, the minimum value is returned. If the number is larger than the
 * maximum value, the maximum value is returned. Otherwise, the number is returned.
 *
 * @param n The number to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns The clamped value
 * @example clamp(100, 0, 10) // 10
 */
export function clamp(n: number, min: number, max: number): number {
  if (min > max) throw new RangeError('Expected min to be less than or equal to max')
  if (n <= min) return min
  if (n >= max) return max
  return n
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should be in range', () => {
    const result = clamp(5, 0, 10)
    expect(result).toEqual(5)
  })

  it('should clamp to a positive number', () => {
    const result = clamp(30, 0, 20)
    expect(result).toEqual(20)
  })

  it('should clamp to a negative number', () => {
    const result = clamp(-20, -10, 10)
    expect(result).toEqual(-10)
  })

  it('should clamp to a positive zero', () => {
    const result = clamp(-0, -10, 0)
    expect(result).toEqual(0)
  })

  it('should throw an error if min is greater than max', () => {
    const shouldThrow = () => clamp(0, 10, 0)
    expect(shouldThrow).toThrow(RangeError)
  })
}
