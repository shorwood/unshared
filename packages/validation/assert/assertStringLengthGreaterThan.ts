import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a string has a length greater than a minimum value.
 *
 * @param minimum The minimum length the string must be greater than.
 * @returns A function that asserts a string length is greater than the given minimum.
 * @example assertStringLengthGreaterThan(3)('Hello') // void
 */
export function assertStringLengthGreaterThan(minimum: number): (value: unknown) => asserts value is string {
  return (value: unknown): asserts value is string => {
    assertString(value)
    if (value.length > minimum) return
    throw createAssertionError({
      name: 'E_STRING_LENGTH_NOT_GREATER_THAN',
      message: `String length ${value.length} is not greater than ${minimum}.`,
      context: { value: value.length, minimum },
      schema: { type: 'string', minLength: minimum + 1 },
    })
  }
}
