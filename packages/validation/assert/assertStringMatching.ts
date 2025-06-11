import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that matches a regular expression.
 *
 * @param pattern The regular expression to match the value against.
 * @returns A function that asserts a value is a string matching the given pattern.
 * @example assertStringMatching(/Hello, \w+!/)('Hello, World!') // void
 */
export function assertStringMatching(pattern: RegExp): (value: unknown) => asserts value is string {
  return (value: unknown): asserts value is string => {
    assertString(value)
    if (pattern.test(value)) return
    throw createAssertionError({
      name: 'E_STRING_NOT_MATCHING',
      message: `String does not match the regular expression: ${pattern}.`,
      context: { value, pattern },
      schema: { type: 'string', pattern: pattern.source },
    })
  }
}
