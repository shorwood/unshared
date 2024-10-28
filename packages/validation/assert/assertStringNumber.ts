import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

// assertStringNumber.ts
/** Regular expression that matches a string representation of a number. */
const EXP_NUMBER = /^[+-]?\d+(?:\.\d+)?$/

/**
 * Assert that a value is a string and can be converted to a number.
 *
 * @param value The value to assert as a string number.
 * @throws `ValidationError` if the value is not a string number.
 * @example assertStringNumber('5') // void
 */
export function assertStringNumber(value: unknown): asserts value is `${number}` {
  assertString(value)
  if (EXP_NUMBER.test(value)) return
  throw new ValidationError({
    name: 'E_NOT_STRING_NUMBER',
    message: 'String is not parseable as a number.',
    context: { value },
  })
}
