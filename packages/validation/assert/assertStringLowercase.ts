import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in lowercase.
 *
 * @param value The value to assert as in lowercase.
 * @throws `AssertionError` if the value is not in lowercase.
 * @example assertStringLowercase('hello world') // void
 */
export function assertStringLowercase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === value.toLowerCase()) return
  throw createAssertionError({
    name: 'E_STRING_NOT_LOWERCASE',
    message: 'String is not in lowercase.',
    context: { value },
    schema: { type: 'string', format: 'lowercase' },
  })
}
