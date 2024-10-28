import type { NotUndefined } from '@unshared/types'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is not `undefined`.
 *
 * @param value The value to assert as not `undefined`.
 * @throws `ValidationError` if the value is `undefined`.
 * @example assertNotUndefined(1) // void
 */
export function assertNotUndefined<T>(value: T): asserts value is NotUndefined<T> {
  if (value !== undefined) return
  throw new ValidationError({
    name: 'E_IS_UNDEFINED',
    message: 'Value is undefined.',
    context: { value },
  })
}
