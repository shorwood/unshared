import type { NumberInteger } from '@unshared/types'

/** The index of a byte in a 32-bit number. */
export type ByteIndex = 0 | 1 | 2 | 3

/**
 * Sets the byte at the specified index to a specified state. The index indicates
 * the position of the byte to modify, where 0 is the least significant byte and
 * 3 is the most significant byte.
 *
 * @param value The value to set the byte in.
 * @param index The index of the byte to set.
 * @param state The state to set the byte to.
 * @returns The value with the byte set.
 * @example setByte(0x00000000, 0, 0x64) // 0x00000064
 */
export function setByte<N extends number>(value: NumberInteger<N>, index: ByteIndex, state: number): number {
  if (Number.isInteger(value) === false)
    throw new TypeError('Could not set bit: The value must be a safe integer.')
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
