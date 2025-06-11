import { createAssertionError } from '../createAssertionError'
import { assertArray } from './assertArray'

/**
 * Assert that an array has a length lower than a maximum value.
 *
 * @param maximum The maximum length the array must be lower than.
 * @returns A function that asserts an array length is lower than the given maximum.
 * @example assertArrayLengthLowerThan(5)([1, 2, 3]) // void
 */
export function assertArrayLengthLowerThan(maximum: number): (value: unknown) => asserts value is unknown[] {
  return (value: unknown): asserts value is unknown[] => {
    assertArray(value)
    if (value.length < maximum) return
    throw createAssertionError({
      name: 'E_ARRAY_LENGTH_NOT_LOWER_THAN',
      message: `Array length ${value.length} is not lower than ${maximum}.`,
      context: { value: value.length, maximum },
      schema: { type: 'array', maxItems: maximum - 1 },
    })
  }
}
