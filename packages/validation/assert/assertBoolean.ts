import { kindOf } from '@unshared/functions/kindOf'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is a boolean.
 *
 * @param value The value to assert as a boolean.
 * @throws `AssertionError` if the value is not a boolean.
 * @example assertBoolean(true) // void
 */
export function assertBoolean(value: unknown): asserts value is boolean {
  if (typeof value === 'boolean') return
  throw createAssertionError({
    name: 'E_NOT_BOOLEAN',
    message: 'Value is not a boolean.',
    context: { value, received: kindOf(value) },
    schema: { type: 'boolean' },
  })
}
