import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string and that it is not empty. An empty string
 * is a string that has a length of zero or only contains whitespace characters.
 *
 * @param value The value to assert as a non-empty string.
 * @throws `ValidationError` if the value is not a non-empty string.
 * @example assertStringNotEmpty('Hello, World!') // void
 */
export function assertStringNotEmpty(value: unknown): asserts value is string {
  assertString(value)
  if (value.trim().length > 0) return
  throw new ValidationError({
    name: 'E_STRING_EMPTY',
    message: 'String is empty.',
    context: { value },
  })
}
