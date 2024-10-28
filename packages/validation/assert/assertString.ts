import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is a string.
 *
 * @param value The value to assert as a string.
 * @throws `ValidationError` if the value is not a string.
 * @example assertString('Hello, World!') // void
 */
export function assertString(value: unknown): asserts value is string {
  if (typeof value === 'string') return
  throw new ValidationError({
    name: 'E_NOT_STRING',
    message: 'Value is not a string.',
    context: { value, received: kindOf(value) },
  })
}
