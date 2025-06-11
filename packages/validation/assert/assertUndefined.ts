import { kindOf } from '@unshared/functions/kindOf'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is `undefined`.
 *
 * @param value The value to assert as `undefined`.
 * @throws `AssertionError` if the value is not `undefined`.
 * @example assertUndefined(undefined) // void
 */
export function assertUndefined(value: unknown): asserts value is undefined {
  if (value === undefined) return
  throw createAssertionError({
    name: 'E_NOT_UNDEFINED',
    message: 'Value is not undefined.',
    context: { value, received: kindOf(value) },
    schema: { type: 'null' },
  })
}
