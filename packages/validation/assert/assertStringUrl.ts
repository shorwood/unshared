import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is a valid URL.
 *
 * @param value The value to assert as a valid URL.
 * @throws `AssertionError` if the value is not a valid URL.
 * @example assertStringUrl('https://example.com') // void
 */
export function assertStringUrl(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  try {
    new URL(value)
  }
  catch {
    throw createAssertionError({
      name: 'E_STRING_NOT_URL',
      message: 'String is not a valid URL.',
      context: { value },
      schema: { type: 'string', format: 'uri' },
    })
  }
}
