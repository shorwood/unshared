import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that strictly equals a given string.
 *
 * @param value The value to assert as a string equal to the given string.
 * @param expected The string to compare the value against.
 * @throws `ValidationError` if the value is not a string or does not equal the expected string.
 * @example assertStringEqual('Hello, World!', 'Hello, World!') // void
 */
export function assertStringEquals<T extends string>(value: unknown, expected: T): asserts value is T {
  assertString(value)
  if (value === expected) return
  throw new ValidationError({
    name: 'E_STRING_NOT_EQUAL',
    message: `String is not equal to "${expected}".`,
    context: { value, expected },
  })
}
