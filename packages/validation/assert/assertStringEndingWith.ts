import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that ends with the given string.
 *
 * @param value The value to assert as a string ending with the given string.
 * @param end The string to match the end of the value against.
 * @throws `ValidationError` if the value is not a string or does not end with the given string.
 * @example assertStringEndingWith('Hello, World!', 'World!') // void
 */

export function assertStringEndingWith<T extends string>(value: unknown, end: T): asserts value is `${string}${T}` {
  assertString(value)
  if (value.endsWith(end)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_ENDING_WITH',
    message: `String is not ending with "${end}".`,
    context: { value, end },
  })
}
