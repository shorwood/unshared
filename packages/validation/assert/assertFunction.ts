import type { Function } from '@unshared/types'
import { kindOf } from '@unshared/functions'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is a function.
 *
 * @param value The value to assert as a function.
 * @throws `ValidationError` if the value is not a function.
 * @example assertFunction(() => {}) // void
 */
export function assertFunction<T extends Function>(value: unknown): asserts value is T {
  if (typeof value === 'function') return
  throw new ValidationError({
    name: 'E_NOT_FUNCTION',
    message: 'Value is not a function.',
    context: { value, received: kindOf(value) },
  })
}
