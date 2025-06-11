import { createAssertionError } from '../createAssertionError'
import { assertArray } from './assertArray'

/**
 * Assert that an array has a length lower than or equal to a maximum value.
 *
 * @param maximum The maximum length the array must be lower than or equal to.
 * @returns A function that asserts an array length is lower than or equal to the given maximum.
 * @example assertArrayLengthLowerThanOrEqual(5)([1, 2, 3, 4, 5]) // void
 */
export function assertArrayLengthLowerThanOrEqual(maximum: number): (value: unknown) => asserts value is unknown[] {
  return (value: unknown): asserts value is unknown[] => {
    assertArray(value)
    if (value.length <= maximum) return
    throw createAssertionError({
      name: 'E_ARRAY_LENGTH_NOT_LOWER_THAN_OR_EQUAL',
      message: `Array length ${value.length} is not lower than or equal to ${maximum}.`,
      context: { value: value.length, maximum },
      schema: { type: 'array', maxItems: maximum },
    })
  }
}
