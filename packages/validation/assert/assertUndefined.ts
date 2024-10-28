import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is `undefined`.
 *
 * @param value The value to assert as `undefined`.
 * @throws `ValidationError` if the value is not `undefined`.
 * @example assertUndefined(undefined) // void
 */
export function assertUndefined(value: unknown): asserts value is undefined {
  if (value === undefined) return
  throw new ValidationError({
    name: 'E_NOT_UNDEFINED',
    message: 'Value is not undefined.',
    context: { value, received: kindOf(value) },
  })
}
