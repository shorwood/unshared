import { kindOf } from '@unshared/functions/kindOf'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is `null`.
 *
 * @param value The value to assert as `null`.
 * @throws `AssertionError` if the value is not `null`.
 * @example assertNull(null) // void
 */
export function assertNull(value: unknown): asserts value is null {
  if (value === null) return
  throw createAssertionError({
    name: 'E_NOT_NULL',
    message: 'Value is not null.',
    context: { value, received: kindOf(value) },
    schema: { type: 'null' },
  })
}
