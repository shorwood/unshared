import { escapeRegexp } from '@unshared/string/escapeRegexp'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that ends with the given string.
 *
 * @param end The string to match the end of the value against.
 * @returns A function that asserts a value is a string ending with the given string.
 * @example assertStringEndingWith('World!')('Hello, World!') // void
 */
export function assertStringEndingWith<T extends string>(end: T): (value: unknown) => asserts value is `${string}${T}` {
  return (value: unknown): asserts value is `${string}${T}` => {
    assertString(value)
    if (value.endsWith(end)) return
    throw createAssertionError({
      name: 'E_STRING_NOT_ENDING_WITH',
      message: `String is not ending with "${end}".`,
      context: { value, end },
      schema: { type: 'string', pattern: `.*${escapeRegexp(end)}$` },
    })
  }
}
