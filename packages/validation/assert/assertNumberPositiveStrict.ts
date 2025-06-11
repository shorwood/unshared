import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is strictly a number greater than `0`.
 *
 * @param value The value to assert as a number greater than `0`.
 * @throws `AssertionError` if the value is not a number greater than `0`.
 * @example assertNumberPositiveStrict(1) // void
 */
export function assertNumberPositiveStrict(value: unknown): asserts value is number {
  assertNumber(value)
  if (value > 0) return
  throw createAssertionError({
    name: 'E_NUMBER_NOT_POSITIVE_STRICT',
    message: 'Number is not strictly positive.',
    context: { value },
    schema: { type: 'number', exclusiveMinimum: 0 },
  })
}
