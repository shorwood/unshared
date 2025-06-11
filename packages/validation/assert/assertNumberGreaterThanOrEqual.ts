import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number greater than or equal to a minimum value.
 *
 * @param minimum The minimum value the number must be greater than or equal to.
 * @returns A function that asserts a number is greater than or equal to the given minimum value.
 * @example assertNumberGreaterThanOrEqual(0)(0) // void
 */
export function assertNumberGreaterThanOrEqual(minimum: number): (value: unknown) => asserts value is number {
  return (value: unknown): asserts value is number => {
    assertNumber(value)
    if (value >= minimum) return
    throw createAssertionError({
      name: 'E_NUMBER_NOT_GREATER_THAN_OR_EQUAL',
      message: `Number is not greater than or equal to ${minimum}.`,
      context: { value, minimum },
      schema: { type: 'number', minimum },
    })
  }
}
