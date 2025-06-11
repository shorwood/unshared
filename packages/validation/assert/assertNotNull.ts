import type { NotNull } from '@unshared/types'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is not `null`.
 *
 * @param value The value to assert as not `null`.
 * @throws `AssertionError` if the value is `null`.
 * @example assertNotNull(1) // void
 */
export function assertNotNull<T>(value: T): asserts value is NotNull<T> {
  if (value !== null) return
  throw createAssertionError({
    name: 'E_IS_NULL',
    message: 'Value is null.',
    context: { value },
    schema: { not: { type: 'null' } },
  })
}
