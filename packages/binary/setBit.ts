import type { NumberInteger } from '@unshared/types'

/** The index of a bit in a 32-bit integer. */
export type BitIndex =
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
export function setBit<N extends number>(value: NumberInteger<N>, index: BitIndex, state: boolean): number {
  if (Number.isInteger(value) === false)
    throw new TypeError('Could not set bit: The value must be a safe integer.')
  if (index < 0 || index > 31)
    throw new RangeError('Could not set bit: The index must be between 0 and 31.')

  // --- Set the bit.
  return state
    ? value | (0b00000001 << index)
    : value & ~(0b00000001 << index)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should set the first bit to 1', () => {
    const result = setBit(0, 0, true)
    expect(result).toBe(1)
  })

  test('should set the first bit to 0', () => {
    const result = setBit(1, 0, false)
    expect(result).toBe(0)
  })

  test('should set the last bit to 1', () => {
    const result = setBit(0, 31, true)
    expect(result).toBe(-0b10000000000000000000000000000000)
  })

  test('should set the last bit to 0', () => {
    const result = setBit(0b100000000000000000000000000000000, 31, false)
    expect(result).toBe(0)
  })

  test('should throw if the index is greater than 31', () => {

    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => setBit(0, 32, true)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should throw if the index is less than 0', () => {

    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => setBit(0, -1, true)
    expect(shouldThrow).toThrow(RangeError)
  })
}
