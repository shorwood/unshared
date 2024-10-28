import { ValidationError } from '../createValidationError'
import { assertArray } from './assertArray'

/**
 * Assert that a value is a non-empty array.
 *
 * @param value The value to assert as a non-empty array.
 * @throws `ValidationError` if the value is not a non-empty array.
 * @example assertArrayNotEmpty(['Hello, World!']) // void
 */
export function assertArrayNotEmpty<T>(value: unknown): asserts value is T[] {
  assertArray(value)
  if (value.length > 0) return
  throw new ValidationError({
    name: 'E_ARRAY_EMPTY',
    message: 'Array is empty.',
    context: { value },
  })
}
