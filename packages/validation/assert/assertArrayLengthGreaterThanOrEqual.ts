import { createAssertionError } from '../createAssertionError'
import { assertArray } from './assertArray'

/**
 * Assert that an array has a length greater than or equal to a minimum value.
 *
 * @param minimum The minimum length the array must be greater than or equal to.
 * @returns A function that asserts an array length is greater than or equal to the given minimum.
 * @example assertArrayLengthGreaterThanOrEqual(2)([1, 2]) // void
 */
export function assertArrayLengthGreaterThanOrEqual(minimum: number): (value: unknown) => asserts value is unknown[] {
  return (value: unknown): asserts value is unknown[] => {
    assertArray(value)
    if (value.length >= minimum) return
    throw createAssertionError({
      name: 'E_ARRAY_LENGTH_NOT_GREATER_THAN_OR_EQUAL',
      message: `Array length ${value.length} is not greater than or equal to ${minimum}.`,
      context: { value: value.length, minimum },
      schema: { type: 'array', minItems: minimum },
    })
  }
}
