import type { ObjectLike } from '@unshared/types'
import { kindOf } from '@unshared/functions/kindOf'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is loosely an object. This means that the value is not `null`
 * and that it is an instance of some class that inherits from `Object`.
 *
 * @param value The value to assert as an object.
 */
export function assertObject<T extends ObjectLike>(value: unknown): asserts value is T {
  if (typeof value === 'object' && value !== null) return
  throw createAssertionError({
    name: 'E_NOT_OBJECT',
    message: 'Value is not an object.',
    context: { value, received: kindOf(value) },
    schema: { type: 'object' },
  })
}
