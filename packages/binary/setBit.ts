import { NumberInteger } from '@unshared/types'

export type SetBitIndex =
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
  8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
  16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |
  24 | 25 | 26 | 27 | 28 | 29 | 30 | 31

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
export function setBit<N extends number>(value: NumberInteger<N>, index: SetBitIndex, state: boolean): number {
  if (Number.isSafeInteger(value) === false)
    throw new TypeError('Could not set bit: The value must be a safe integer.')
  if (Number.isSafeInteger(index) === false)
    throw new TypeError('Could not set bit: The index must be a safe integer.')
  if (index < 0 || index > 31)
    throw new RangeError('Could not set bit: The index must be between 0 and 31.')

  // --- Set the bit.
  return state
    ? value | (1 << index)
    : value & ~(1 << index)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should set the first bit to 1', () => {
    const result = setBit(0b0000, 0, true)
    expect(result).toEqual(0b0001)
  })

  it('should set the first bit to 0', () => {
    const result = setBit(0b0001, 0, false)
    expect(result).toEqual(0)
  })

  it('should set the last bit to 1', () => {
    const result = setBit(0b0000, 31, true)
    expect(result).toEqual(-0b10000000000000000000000000000000)
  })

  it('should set the last bit to 0', () => {
    const result = setBit(0b100000000000000000000000000000000, 31, false)
    expect(result).toEqual(0)
  })

  it('should throw if the index is greater than 31', () => {
    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => setBit(0b0000, 32, true)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw if the index is less than 0', () => {
    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => setBit(0b0000, -1, true)
    expect(shouldThrow).toThrow(RangeError)
  })
}
