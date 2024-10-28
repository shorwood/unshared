import type { NotNil } from '@unshared/types'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is not `null` or `undefined`.
 *
 * @param value The value to assert as not `null` or `undefined`.
 * @throws `ValidationError` if the value is `null` or `undefined`.
 * @example assertNotNil(1) // void
 */
export function assertNotNil<T>(value: T): asserts value is NotNil<T> {
  if (value !== null && value !== undefined) return
  throw new ValidationError({
    name: 'E_IS_NIL',
    message: 'Value is null or undefined.',
    context: { value },
  })
}
