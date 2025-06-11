import type { ObjectLike } from '@unshared/types'
import { kindOf } from '@unshared/functions/kindOf'
import { createAssertionError } from '../createAssertionError'
import { assertObject } from './assertObject'

/**
 * Assert that a value is strictly an object. This means that the value is neither
 * `null` nor an instance of some class that inherits from `Object`.
 *
 * @param value The value to assert as an object.
 * @throws `AssertionError` if the value is not an object.
 * @example assertObjectStrict({}) // void
 */
export function assertObjectStrict<T extends ObjectLike>(value: unknown): asserts value is T {
  assertObject(value)
  const kind = kindOf(value)
  if (kind === 'object') return
  throw createAssertionError({
    name: 'E_NOT_OBJECT_STRICT',
    message: 'Value is not strictly an object.',
    context: { value, received: kind },
    schema: { type: 'object' },
  })
}
