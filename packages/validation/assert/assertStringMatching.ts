import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that matches a regular expression.
 *
 * @param value The value to assert as a string matching a regular expression.
 * @param pattern The regular expression to match the value against.
 * @example assertStringMatching('Hello, World!', /Hello, \w+!/) // void
 */
export function assertStringMatching(value: unknown, pattern: RegExp): asserts value is string {
  assertString(value)
  if (pattern.test(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_MATCHING',
    message: `String does not match the regular expression: ${pattern}.`,
    context: { value, pattern },
  })
}
