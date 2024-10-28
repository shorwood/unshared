import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that starts the given string.
 *
 * @param value The value to assert as a string starting with the given string.
 * @param start The string to match the start of the value against.
 * @throws `ValidationError` if the value is not a string or does not start with the given string.
 */
export function assertStringStartingWith<T extends string>(value: unknown, start: T): asserts value is `${T}${string}` {
  assertString(value)
  if (value.startsWith(start)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_STARTING_WITH',
    message: `String does not start with "${start}".`,
    context: { value, start },
  })
}
