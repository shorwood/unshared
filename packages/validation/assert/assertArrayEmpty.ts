import { createAssertionError } from '../createAssertionError'
import { assertArray } from './assertArray'

/**
 * Assert that a value is an empty array.
 *
 * @param value The value to assert as an empty array.
 * @throws `AssertionError` if the value is not an empty array.
 * @example assertArrayEmpty([]) // void
 */
export function assertArrayEmpty(value: unknown): asserts value is [] {
  assertArray(value)
  if (value.length === 0) return
  throw createAssertionError({
    name: 'E_ARRAY_NOT_EMPTY',
    message: 'Array is not empty.',
    context: { value, length: value.length },
    schema: { type: 'array', maxItems: 0 },
  })
}
