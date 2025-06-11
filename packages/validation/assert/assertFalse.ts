import { createAssertionError } from '../createAssertionError'
import { assertBoolean } from './assertBoolean'

/**
 * Assert that a value is a boolean equal to `false`.
 *
 * @param value The value to assert as a boolean equal to `false`.
 * @throws `AssertionError` if the value is not a boolean equal to `false`.
 * @example assertFalse(false) // void
 */
export function assertFalse(value: unknown): asserts value is false {
  assertBoolean(value)
  if (value === false) return
  throw createAssertionError({
    name: 'E_BOOLEAN_NOT_FALSE',
    message: 'Boolean is not false.',
    context: { value },
    schema: { type: 'boolean', const: false },
  })
}
