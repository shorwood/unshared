import { createAssertionError } from '../createAssertionError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is strictly between a minimum and maximum value.
 *
 * @param exclusiveMinimum The lower bound of the range.
 * @param exclusiveMaximum The upper bound of the range.
 * @returns A function that asserts a number is strictly between the given minimum and maximum values.
 * @example assertNumberInRangeStrict(5, 1, 10) // void
 */
export function assertNumberInRangeStrict(exclusiveMinimum: number, exclusiveMaximum: number): (value: unknown) => asserts value is number {
  return (value: unknown) => {
    assertNumber(value)
    if (value > exclusiveMinimum && value < exclusiveMaximum) return
    throw createAssertionError({
      name: 'E_NUMBER_OUT_OF_RANGE_STRICT',
      message: `Number is not strictly between ${exclusiveMinimum} and ${exclusiveMaximum}.`,
      context: { value, min: exclusiveMinimum, max: exclusiveMaximum },
      schema: { type: 'number', exclusiveMinimum, exclusiveMaximum },
    })
  }
}
