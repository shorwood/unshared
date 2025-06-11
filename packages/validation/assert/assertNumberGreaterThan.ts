import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number greater than a minimum value.
 *
 * @param minimum The minimum value the number must be greater than.
 * @returns A function that asserts a number is greater than the given minimum value.
 * @example assertNumberGreaterThan(0)(5) // void
 */
export function assertNumberGreaterThan(minimum: number): (value: unknown) => asserts value is number {
  return (value: unknown): asserts value is number => {
    assertNumber(value)
    if (value > minimum) return
    throw createAssertionError({
      name: 'E_NUMBER_NOT_GREATER_THAN',
      message: `Number is not greater than ${minimum}.`,
      context: { value, minimum },
      schema: { type: 'number', exclusiveMinimum: minimum },
    })
  }
}
