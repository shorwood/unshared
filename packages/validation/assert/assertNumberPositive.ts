import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number greater than or equal to `0`.
 *
 * @param value The value to assert as a number greater than or equal to `0`.
 * @throws `AssertionError` if the value is not a number greater than or equal to `0`.
 * @example assertNumberPositive(1) // void
 */
export function assertNumberPositive(value: unknown): asserts value is number {
  assertNumber(value)
  if (value >= 0) return
  throw createAssertionError({
    name: 'E_NUMBER_NOT_POSITIVE',
    message: 'Number is not positive.',
    context: { value },
    schema: { type: 'number', minimum: 0 },
  })
}
