import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a string has a length lower than a maximum value.
 *
 * @param maximum The maximum length the string must be lower than.
 * @returns A function that asserts a string length is lower than the given maximum.
 * @example assertStringLengthLowerThan(5)('Foo') // void
 */
export function assertStringLengthLowerThan(maximum: number): (value: unknown) => asserts value is string {
  return (value: unknown): asserts value is string => {
    assertString(value)
    if (value.length < maximum) return
    throw createAssertionError({
      name: 'E_STRING_LENGTH_NOT_LOWER_THAN',
      message: `String length ${value.length} is not lower than ${maximum}.`,
      context: { value: value.length, maximum },
      schema: { type: 'string', maxLength: maximum - 1 },
    })
  }
}
