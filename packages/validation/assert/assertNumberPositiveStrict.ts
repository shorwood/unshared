import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is strictly a number greater than `0`.
 *
 * @param value The value to assert as a number greater than `0`.
 * @throws `ValidationError` if the value is not a number greater than `0`.
 * @example assertNumberPositiveStrict(1) // void
 */
export function assertNumberPositiveStrict(value: unknown): asserts value is number {
  assertNumber(value)
  if (value > 0) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_POSITIVE_STRICT',
    message: 'Number is not strictly positive.',
    context: { value },
  })
}
