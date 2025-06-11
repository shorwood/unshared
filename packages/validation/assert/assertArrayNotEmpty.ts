import { createAssertionError } from '../createAssertionError'
import { assertArray } from './assertArray'

/**
 * Assert that a value is a non-empty array.
 *
 * @param value The value to assert as a non-empty array.
 * @throws `AssertionError` if the value is not a non-empty array.
 * @example assertArrayNotEmpty(['Hello, World!']) // void
 */
export function assertArrayNotEmpty<T>(value: unknown): asserts value is T[] {
  assertArray(value)
  if (value.length > 0) return
  throw createAssertionError({
    name: 'E_ARRAY_EMPTY',
    message: 'Array is empty.',
    context: { value },
    schema: { type: 'array', minItems: 1 },
  })
}
