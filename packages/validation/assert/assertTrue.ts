import { ValidationError } from '../createValidationError'
import { assertBoolean } from './assertBoolean'

/**
 * Assert that a value is a boolean equal to `true`.
 *
 * @param value The value to assert as a boolean equal to `true`.
 * @throws `ValidationError` if the value is not a boolean equal to `true`.
 * @example assertTrue(true) // void
 */
export function assertTrue(value: unknown): asserts value is true {
  assertBoolean(value)
  if (value === true) return
  throw new ValidationError({
    name: 'E_BOOLEAN_NOT_TRUE',
    message: 'Boolean is not true.',
    context: { value },
  })
}
