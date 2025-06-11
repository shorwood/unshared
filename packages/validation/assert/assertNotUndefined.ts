import type { NotUndefined } from '@unshared/types'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is not `undefined`.
 *
 * @param value The value to assert as not `undefined`.
 * @throws `AssertionError` if the value is `undefined`.
 * @example assertNotUndefined(1) // void
 */
export function assertNotUndefined<T>(value: T): asserts value is NotUndefined<T> {
  if (value !== undefined) return
  throw createAssertionError({
    name: 'E_IS_UNDEFINED',
    message: 'Value is undefined.',
    context: { value },
    schema: { not: { type: 'null' } },
  })
}
