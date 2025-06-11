import { createAssertionError } from '../createAssertionError'
import { assertArray } from './assertArray'

/**
 * Assert that an array has a length between a minimum and maximum value.
 *
 * @param minimum The minimum length the array must be.
 * @param maximum The maximum length the array must be.
 * @returns A function that asserts an array length is within the given range.
 * @example assertArrayLengthInRange(2, 5)([1, 2, 3]) // void
 */
export function assertArrayLengthInRange(minimum: number, maximum: number): (value: unknown) => asserts value is unknown[] {
  return (value: unknown): asserts value is unknown[] => {
    assertArray(value)
    if (value.length >= minimum && value.length <= maximum) return
    throw createAssertionError({
      name: 'E_ARRAY_LENGTH_OUT_OF_RANGE',
      message: `Array length ${value.length} is not between ${minimum} and ${maximum}.`,
      context: { value: value.length, min: minimum, max: maximum },
      schema: { type: 'array', minItems: minimum, maxItems: maximum },
    })
  }
}
