import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is strictly between a minimum and maximum value.
 *
 * @param value The value to assert as a number.
 * @param min The lower bound of the range.
 * @param max The upper bound of the range.
 * @example assertNumberInRangeStrict(5, 1, 10) // void
 */
export function assertNumberInRangeStrict(value: unknown, min: number, max: number): asserts value is number {
  assertNumber(value)
  if (value > min && value < max) return
  throw new ValidationError({
    name: 'E_NUMBER_OUT_OF_RANGE_STRICT',
    message: `Number is not strictly between ${min} and ${max}.`,
    context: { value, min, max },
  })
}
