import { kindOf } from '@unshared/functions/kindOf'
import { AssertionError, createAssertionError } from '../createAssertionError'
import { createParser, type ParserLike } from '../createParser'
import { assertStringEquals } from './assertStringEquals'
import { assertStringUrl } from './assertStringUrl'

/**
 * Assert that a URL string has a hostname that passes a given assertion function or equals a given string.
 *
 * @param rules The assertion function or functions to apply to the hostname, or a string to check for equality.
 * @returns A function that asserts a URL string has a hostname that passes the assertion.
 * @example assertStringUrlHostname('example.com')('https://example.com/path') // void
 * @example assertStringUrlHostname(assertStringStartingWith('api.'))('https://api.example.com') // void
 */
export function assertStringUrlHostname<T extends ParserLike | string>(...rules: T extends string ? [T] : T): (value: unknown) => asserts value is string {
  const parsers = rules.map(rule => (typeof rule === 'string' ? assertStringEquals(rule) : rule)) as ParserLike
  const parse = createParser(...parsers)
  return (value: unknown): asserts value is string => {
    assertStringUrl(value)
    const hostname = new URL(value).hostname
    try {
      parse(hostname)
    }
    catch (error) {
      throw createAssertionError({
        name: 'E_URL_HOSTNAME_NOT_MATCHING',
        message: `URL hostname "${hostname}" does not pass the assertion.`,
        context: { value: hostname, url: value, received: kindOf(hostname) },
        schema: { type: 'string', pattern: error instanceof AssertionError ? error.schema?.pattern : undefined },
        cause: error,
      })
    }
  }
}
