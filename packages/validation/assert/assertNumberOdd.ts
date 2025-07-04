import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'
import { assertNumberInteger } from './assertNumberInteger'

/**
 * Obligatory meme function to assert if a value is an odd number.
 *
 * @param value The value to assert as an odd number.
 * @throws `AssertionError` if the value is not an odd number.
 * @example assertNumberOdd(1) // true
 */
export function assertNumberOdd(value: unknown): asserts value is number {
  assertNumber(value)
  assertNumberInteger(value)
  if ((value & 0x1) !== 0) return
  throw createAssertionError({
    name: 'E_NUMBER_NOT_ODD',
    message: 'Number is not odd.',
    context: { value },
    schema: { type: 'number', not: { multipleOf: 2 } },
  })
}
