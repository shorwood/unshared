import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is a number.
 *
 * @param value The value to assert as a number.
 * @throws `ValidationError` if the value is not a number.
 * @example assertNumber(1) // void
 */
export function assertNumber(value: unknown): asserts value is number {
  if (typeof value === 'number' && !Number.isNaN(value)) return
  throw new ValidationError({
    name: 'E_NOT_NUMBER',
    message: 'Value is not a number.',
    context: { value, received: kindOf(value) },
  })
}
