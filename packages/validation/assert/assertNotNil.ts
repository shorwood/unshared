import type { NotNil } from '@unshared/types'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is not `null` or `undefined`.
 *
 * @param value The value to assert as not `null` or `undefined`.
 * @throws `AssertionError` if the value is `null` or `undefined`.
 * @example assertNotNil(1) // void
 */
export function assertNotNil<T>(value: T): asserts value is NotNil<T> {
  if (value !== null && value !== undefined) return
  throw createAssertionError({
    name: 'E_IS_NIL',
    message: 'Value is null or undefined.',
    context: { value },
    schema: { not: { type: 'null' } },
  })
}
