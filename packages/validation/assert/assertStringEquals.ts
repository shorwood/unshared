import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that strictly equals a given string.
 *
 * @param expected The string to compare the value against.
 * @returns A function that asserts a value is a string equal to the given string.
 * @example assertStringEquals('Hello, World!')('Hello, World!') // void
 */
export function assertStringEquals<T extends string>(expected: T): (value: unknown) => asserts value is T {
  return (value: unknown): asserts value is T => {
    assertString(value)
    if (value === expected) return
    throw createAssertionError({
      name: 'E_STRING_NOT_EQUAL',
      message: `String is not equal to "${expected}".`,
      context: { value, expected },
      schema: { type: 'string', const: expected },
    })
  }
}
