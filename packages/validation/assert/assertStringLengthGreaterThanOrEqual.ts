import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a string has a length greater than or equal to a minimum value.
 *
 * @param minimum The minimum length the string must be greater than or equal to.
 * @returns A function that asserts a string length is greater than or equal to the given minimum.
 * @example assertStringLengthGreaterThanOrEqual(3)('Foo') // void
 */
export function assertStringLengthGreaterThanOrEqual(minimum: number): (value: unknown) => asserts value is string {
  return (value: unknown): asserts value is string => {
    assertString(value)
    if (value.length >= minimum) return
    throw createAssertionError({
      name: 'E_STRING_LENGTH_NOT_GREATER_THAN_OR_EQUAL',
      message: `String length ${value.length} is not greater than or equal to ${minimum}.`,
      context: { value: value.length, minimum },
      schema: { type: 'string', minLength: minimum },
    })
  }
}
