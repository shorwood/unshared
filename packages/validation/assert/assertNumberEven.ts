import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'
import { assertNumberInteger } from './assertNumberInteger'

/**
 * Obligatory meme function to assert if a value is an even number.
 *
 * @param value The value to assert as an even number.
 * @throws `ValidationError` if the value is not an even number.
 * @example assertNumberEven(2) // true
 */
export function assertNumberEven(value: unknown): asserts value is number {
  assertNumber(value)
  assertNumberInteger(value)
  if ((value & 1) === 0) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_EVEN',
    message: 'Number is not even.',
    context: { value },
  })
}
