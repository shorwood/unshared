/**
 * Swap endian of a 32-bit number
 *
 * @param n The number to swap
 * @returns The number with swapped endian
 */
export function swapEndian(n: number): number {
  if (Number.isSafeInteger(n) === false)
    throw new TypeError('Expected an integer.')
  if (n < 0 || n > 0xFFFFFFFF)
    throw new RangeError('Expected a 32-bit number.')

  // --- Swap the endian.
  const a = ((n << 8) | (n >>> 24)) & 0x00FF00FF
  const b = ((n << 24) | (n >>> 8)) & 0xFF00FF00
  return a | b
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should swap the endian of a 32-bit number', () => {
    const result = swapEndian(0x12345678)
    expect(result).toEqual(0x78563412)
  })

  it('should throw an error if the parameter is not a number', () => {
    // @ts-expect-error: invalid argument type
    const shouldThrow = () => swapEndian('12345678')
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the parameter is not an integer', () => {
    const shouldThrow = () => swapEndian(12345678.9)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the parameter is not a 32-bit number', () => {
    const shouldThrow = () => swapEndian(0x123456789)
    expect(shouldThrow).toThrowError(RangeError)
  })
}
