import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is a boolean.
 *
 * @param value The value to assert as a boolean.
 * @throws `ValidationError` if the value is not a boolean.
 * @example assertBoolean(true) // void
 */
export function assertBoolean(value: unknown): asserts value is boolean {
  if (typeof value === 'boolean') return
  throw new ValidationError({
    name: 'E_NOT_BOOLEAN',
    message: 'Value is not a boolean.',
    context: { value, received: kindOf(value) },
  })
}
