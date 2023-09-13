/**
 * Sets the byte at the specified index to a specified state. The index indicates
 * the position of the byte to modify, where 0 is the least significant byte and
 * 3 is the most significant byte.
 *
 * @param value The value to set the byte in.
 * @param index The index of the byte to set.
 * @param state The state to set the byte to.
 * @returns The value with the byte set.
 * @example setByte(0x00000000, 0, 0x64) // 0x000000FF
 */
export function setByte(value: number, index: number, state: number): number {
  if (index < 0 || index > 3)
    throw new RangeError('Could not set byte: The index must be between 0 and 3.')

  // --- Use BigInt to prevent unwanted sign extension.
  const shift = BigInt(index * 8)
  const mask = (0xFFn << shift)
  const valueUnsign = BigInt(value)
  const stateUnsign = BigInt(state)

  // --- Return the result.
  return Number((valueUnsign & ~mask) | ((stateUnsign << shift) & mask))
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should set the first byte to 0x64', () => {
    const result = setByte(0x00000000, 0, 0x64)
    expect(result).toEqual(0x00000064)
  })

  it('should set the first byte to 0x00', () => {
    const result = setByte(0x00000064, 0, 0x00)
    expect(result).toEqual(0x00000000)
  })

  it('should set the last byte to 0x64', () => {
    const result = setByte(0x00000000, 3, 0x64)
    expect(result).toEqual(0x64000000)
  })

  it('should set the last byte to 0x00', () => {
    const result = setByte(0x64000000, 3, 0x00)
    expect(result).toEqual(0x00000000)
  })

  it('should throw if the index is greater than 3', () => {
    const shouldThrow = () => setByte(0x00000000, 4, 0x64)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw if the index is less than 0', () => {
    const shouldThrow = () => setByte(0x00000000, -1, 0x64)
    expect(shouldThrow).toThrow(RangeError)
  })
}
