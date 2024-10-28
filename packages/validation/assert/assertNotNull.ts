import type { NotNull } from '@unshared/types'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is not `null`.
 *
 * @param value The value to assert as not `null`.
 * @throws `ValidationError` if the value is `null`.
 * @example assertNotNull(1) // void
 */
export function assertNotNull<T>(value: T): asserts value is NotNull<T> {
  if (value !== null) return
  throw new ValidationError({
    name: 'E_IS_NULL',
    message: 'Value is null.',
    context: { value },
  })
}
