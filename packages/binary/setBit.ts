/**
 * Sets the bit at the specified index to a specified state. The index indicates
 * the position of the bit to modify, where 0 is the least significant bit and 31
 * is the most significant bit.
 *
 * @param value The value to set the bit in.
 * @param index The index of the bit to set.
 * @param state The state to set the bit to.
 * @returns The value with the bit set.
 * @example setBit(0b0000, 0, 1) // 0b0001
 */
export function setBit(value: number, index: number, state: 0 | 1): number {
  if (index < 0 || index > 31)
    throw new RangeError('Could not set bit: The index must be between 0 and 31.')

  return state === 1
    ? value | (1 << index)
    : value & ~(1 << index)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should set the first bit to 1', () => {
    const result = setBit(0b0000, 0, 1)
    expect(result).toEqual(0b0001)
  })

  it('should set the first bit to 0', () => {
    const result = setBit(0b0001, 0, 0)
    expect(result).toEqual(0)
  })

  it('should set the last bit to 1', () => {
    const result = setBit(0b0000, 31, 1)
    expect(result).toEqual(-0b10000000000000000000000000000000)
  })

  it('should set the last bit to 0', () => {
    const result = setBit(0b10000000000000000000000000000000, 31, 0)
    expect(result).toEqual(0)
  })

  it('should throw if the index is greater than 31', () => {
    const shouldThrow = () => setBit(0b0000, 32, 1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw if the index is less than 0', () => {
    const shouldThrow = () => setBit(0b0000, -1, 1)
    expect(shouldThrow).toThrow(RangeError)
  })
}
