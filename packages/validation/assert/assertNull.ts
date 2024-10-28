import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is `null`.
 *
 * @param value The value to assert as `null`.
 * @throws `ValidationError` if the value is not `null`.
 * @example assertNull(null) // void
 */
export function assertNull(value: unknown): asserts value is null {
  if (value === null) return
  throw new ValidationError({
    name: 'E_NOT_NULL',
    message: 'Value is not null.',
    context: { value, received: kindOf(value) },
  })
}
