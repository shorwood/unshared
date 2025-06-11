import { kindOf } from '@unshared/functions/kindOf'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is a string.
 *
 * @param value The value to assert as a string.
 * @throws `AssertionError` if the value is not a string.
 * @example assertString('Hello, World!') // void
 */
export function assertString(value: unknown): asserts value is string {
  if (typeof value === 'string') return
  throw createAssertionError({
    name: 'E_NOT_STRING',
    message: 'Value is not a string.',
    context: { value, received: kindOf(value) },
    schema: { type: 'string' },
  })
}
