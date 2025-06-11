import { escapeRegexp } from '@unshared/string/escapeRegexp'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that starts the given string.
 *
 * @param start The string to match the start of the value against.
 * @returns A function that asserts a value is a string starting with the given string.
 * @example assertStringStartingWith('Hello')('Hello, World!') // void
 */
export function assertStringStartingWith<T extends string>(start: T): (value: unknown) => asserts value is `${T}${string}` {
  return (value: unknown): asserts value is `${T}${string}` => {
    assertString(value)
    if (value.startsWith(start)) return
    throw createAssertionError({
      name: 'E_STRING_NOT_STARTING_WITH',
      message: `String does not start with "${start}".`,
      context: { value, start },
      schema: { type: 'string', pattern: escapeRegexp(`^${start}`) },
    })
  }
}
