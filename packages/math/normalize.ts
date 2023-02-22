/**
 * Normalize a number from a given range to a range of 0-1.
 *
 * @param number The number to normalize.
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns The normalized number (0-1).
 */
export function normalize(number: number, min: number, max: number): number {
  if (typeof number !== 'number') throw new TypeError('Expected number to be a number')
  if (typeof min !== 'number') throw new TypeError('Expected min to be a number')
  if (typeof max !== 'number') throw new TypeError('Expected max to be a number')
  if (min > max) throw new RangeError('Expected min to be less than max')

  // --- Handle edge cases.
  if (number <= min) return 0
  if (number >= max) return 1

  // --- Normalize the number.
  return (number - min) / (max - min)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should normalize a number to a given range', () => {
    const result = normalize(5, 0, 10)
    expect(result).toEqual(0.5)
  })

  it('should normalize a number to a given range with negative numbers', () => {
    const result = normalize(0, -10, 10)
    expect(result).toEqual(0.5)
  })

  it('should normalize and clamp max values', () => {
    const result = normalize(15, 0, 10)
    expect(result).toEqual(1)
  })

  it('should normalize and clamp min values', () => {
    const result = normalize(-5, 0, 10)
    expect(result).toEqual(0)
  })

  it('should throw if number is not a number', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => normalize('foo', 0, 10)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if min is not a number', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => normalize(5, 'foo', 10)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if max is not a number', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => normalize(5, 0, 'foo')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if min is greater than max', () => {
    const shouldThrow = () => normalize(5, 10, 0)
    expect(shouldThrow).toThrow(RangeError)
  })
}
