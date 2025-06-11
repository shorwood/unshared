import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number less than or equal to `0`.
 *
 * @param value The value to assert as a number less than or equal to `0`.
 * @throws `AssertionError` if the value is not a number less than or equal to `0`.
 * @example assertNumberNegative(-1) // void
 */
export function assertNumberNegative(value: unknown): asserts value is number {
  assertNumber(value)
  if (value <= 0) return
  throw createAssertionError({
    name: 'E_NUMBER_NOT_NEGATIVE',
    message: 'Number is not negative.',
    context: { value },
    schema: { type: 'number', maximum: 0 },
  })
}
