import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number between or equal a minimum and maximum value.
 *
 * @param minimum The minimum value the number can be.
 * @param maximum The maximum value the number can be.
 * @returns A function that asserts a number is between or equal a minimum and maximum value.
 * @example assertNumberInRange(0, 1)(0) // void
 */
export function assertNumberInRange(minimum: number, maximum: number): (value: unknown) => asserts value is number {
  return (value: unknown): asserts value is number => {
    assertNumber(value)
    if (value >= minimum && value <= maximum) return
    throw createAssertionError({
      name: 'E_NUMBER_OUT_OF_RANGE',
      message: `Number is not between ${minimum} and ${maximum}.`,
      context: { value, min: minimum, max: maximum },
      schema: { type: 'number', minimum, maximum },
    })
  }
}
