import { kindOf } from '@unshared/functions/kindOf'
import { createValidationError } from '../createValidationError'

/**
 * Assert that a value is an array.
 *
 * @param value The value to assert as an array.
 * @throws `ValidationError` if the value is not an array.
 * @example assertArray(['Hello, World!']) // void
 */
export function assertArray<T>(value: unknown): asserts value is T[] {
  if (Array.isArray(value)) return
  throw createValidationError({
    name: 'E_NOT_ARRAY',
    message: 'Value is not an array.',
    context: { value, received: kindOf(value) },
  })
}
