import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number lower than a maximum value.
 *
 * @param maximum The maximum value the number must be lower than.
 * @returns A function that asserts a number is lower than the given maximum value.
 * @example assertNumberLowerThan(10)(5) // void
 */
export function assertNumberLowerThan(maximum: number): (value: unknown) => asserts value is number {
  return (value: unknown): asserts value is number => {
    assertNumber(value)
    if (value < maximum) return
    throw createAssertionError({
      name: 'E_NUMBER_NOT_LOWER_THAN',
      message: `Number is not lower than ${maximum}.`,
      context: { value, maximum },
      schema: { type: 'number', exclusiveMaximum: maximum },
    })
  }
}
