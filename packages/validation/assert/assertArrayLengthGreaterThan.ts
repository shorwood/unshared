import { createAssertionError } from '../createAssertionError'
import { assertArray } from './assertArray'

/**
 * Assert that an array has a length greater than a minimum value.
 *
 * @param minimum The minimum length the array must be greater than.
 * @returns A function that asserts an array length is greater than the given minimum.
 * @example assertArrayLengthGreaterThan(2)([1, 2, 3]) // void
 */
export function assertArrayLengthGreaterThan(minimum: number): (value: unknown) => asserts value is unknown[] {
  return (value: unknown): asserts value is unknown[] => {
    assertArray(value)
    if (value.length > minimum) return
    throw createAssertionError({
      name: 'E_ARRAY_LENGTH_NOT_GREATER_THAN',
      message: `Array length ${value.length} is not greater than ${minimum}.`,
      context: { value: value.length, minimum },
      schema: { type: 'array', minItems: minimum + 1 },
    })
  }
}
