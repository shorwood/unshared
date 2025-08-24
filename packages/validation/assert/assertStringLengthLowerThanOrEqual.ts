import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a string has a length lower than or equal to a maximum value.
 *
 * @param maximum The maximum length the string must be lower than or equal to.
 * @returns A function that asserts a string length is lower than or equal to the given maximum.
 * @example assertStringLengthLowerThanOrEqual(5)('Hello') // void
 */
export function assertStringLengthLowerThanOrEqual(maximum: number): (value: unknown) => asserts value is string {
  return (value: unknown): asserts value is string => {
    assertString(value)
    if (value.length <= maximum) return
    throw createAssertionError({
      name: 'E_STRING_LENGTH_NOT_LOWER_THAN_OR_EQUAL',
      message: `String length ${value.length} is not lower than or equal to ${maximum}.`,
      context: { value: value.length, maximum },
      schema: { type: 'string', maxLength: maximum },
    })
  }
}
