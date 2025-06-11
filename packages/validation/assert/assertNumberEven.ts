import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'
import { assertNumberInteger } from './assertNumberInteger'

/**
 * Obligatory meme function to assert if a value is an even number.
 *
 * @param value The value to assert as an even number.
 * @throws `AssertionError` if the value is not an even number.
 * @example assertNumberEven(2) // true
 */
export function assertNumberEven(value: unknown): asserts value is number {
  assertNumber(value)
  assertNumberInteger(value)
  if ((value & 1) === 0) return
  throw createAssertionError({
    name: 'E_NUMBER_NOT_EVEN',
    message: 'Number is not even.',
    context: { value },
    schema: { type: 'number', multipleOf: 2 },
  })
}
