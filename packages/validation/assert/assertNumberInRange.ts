import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number between or equal a minimum and maximum value.
 *
 * @param value The value to assert as a number.
 * @param min The minimum value that the number can be.
 * @param max The maximum value that the number can be.
 * @example assertNumberInRange(5, 1, 10) // void
 */
export function assertNumberInRange(value: unknown, min: number, max: number): asserts value is number {
  assertNumber(value)
  if (value >= min && value <= max) return
  throw new ValidationError({
    name: 'E_NUMBER_OUT_OF_RANGE',
    message: `Number is not between ${min} and ${max}.`,
    context: { value, min, max },
  })
}
