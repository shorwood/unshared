import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number lower than or equal to a maximum value.
 *
 * @param maximum The maximum value the number must be lower than or equal to.
 * @returns A function that asserts a number is lower than or equal to the given maximum value.
 * @example assertNumberLowerThanOrEqual(10)(10) // void
 */
export function assertNumberLowerThanOrEqual(maximum: number): (value: unknown) => asserts value is number {
  return (value: unknown): asserts value is number => {
    assertNumber(value)
    if (value <= maximum) return
    throw createAssertionError({
      name: 'E_NUMBER_NOT_LOWER_THAN_OR_EQUAL',
      message: `Number is not lower than or equal to ${maximum}.`,
      context: { value, maximum },
      schema: { type: 'number', maximum },
    })
  }
}
