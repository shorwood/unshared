import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

// assertStringNumber.ts
/** Regular expression that matches a string representation of a number. */
const EXP_NUMBER = /^[+-]?\d+(?:\.\d+)?$/

/**
 * Assert that a value is a string and can be converted to a number.
 *
 * @param value The value to assert as a string number.
 * @throws `AssertionError` if the value is not a string number.
 * @example assertStringNumber('5') // void
 */
export function assertStringNumber(value: unknown): asserts value is `${number}` {
  assertString(value)
  if (EXP_NUMBER.test(value)) return
  throw createAssertionError({
    name: 'E_NOT_STRING_NUMBER',
    message: 'String is not parseable as a number.',
    context: { value },
    schema: { type: 'string', pattern: EXP_NUMBER.source },
  })
}
