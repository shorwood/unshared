import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string and that it is empty. An empty string is a
 * string that has a length of zero or only contains whitespace characters.
 *
 * @param value The value to assert as an empty string.
 * @throws `ValidationError` if the value is not an empty string.
 * @example assertStringEmpty('') // void
 */
export function assertStringEmpty(value: unknown): asserts value is string {
  assertString(value)
  if (value.trim().length === 0) return
  throw new ValidationError({
    name: 'E_STRING_NOT_EMPTY',
    message: 'String is not empty.',
    context: { value },
  })
}
