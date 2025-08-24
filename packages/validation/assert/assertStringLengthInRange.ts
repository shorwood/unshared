import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a string has a length between or equal to a minimum and maximum value.
 *
 * @param minimum The minimum length the string can have.
 * @param maximum The maximum length the string can have.
 * @returns A function that asserts a string length is between or equal to a minimum and maximum value.
 * @example assertStringLengthInRange(2, 5)('Foo') // void
 */
export function assertStringLengthInRange(minimum: number, maximum: number): (value: unknown) => asserts value is string {
  return (value: unknown): asserts value is string => {
    assertString(value)
    if (value.length >= minimum && value.length <= maximum) return
    throw createAssertionError({
      name: 'E_STRING_LENGTH_OUT_OF_RANGE',
      message: `String length ${value.length} is not between ${minimum} and ${maximum}.`,
      context: { value: value.length, min: minimum, max: maximum },
      schema: { type: 'string', minLength: minimum, maxLength: maximum },
    })
  }
}
