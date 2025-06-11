import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is an integer number.
 *
 * @param value The value to assert as an integer number.
 * @throws `AssertionError` if the value is not an integer number.
 * @example assertNumberInteger(1) // void
 */
export function assertNumberInteger(value: unknown): asserts value is number {
  assertNumber(value)
  if (Number.isSafeInteger(value)) return
  throw createAssertionError({
    name: 'E_NUMBER_NOT_INTEGER',
    message: 'Number is not an integer.',
    context: { value },
    schema: { type: 'integer' },
  })
}
