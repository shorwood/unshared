import { kindOf } from '@unshared/functions/kindOf'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is `null` or `undefined`.
 *
 * @param value The value to assert as `null` or `undefined`.
 * @throws `AssertionError` if the value is neither `null` nor `undefined`.
 * @example assertNil(null) // void
 */
export function assertNil(value: unknown): asserts value is null | undefined {
  if (value === null || value === undefined) return
  throw createAssertionError({
    name: 'E_NOT_NIL',
    message: 'Value is neither null nor undefined.',
    context: { value, received: kindOf(value) },
    schema: { type: 'null' },
  })
}
