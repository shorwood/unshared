import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in uppercase.
 *
 * @param value The value to assert as in uppercase.
 * @throws `AssertionError` if the value is not in uppercase.
 * @example assertStringUppercase('HELLO WORLD') // void
 */
export function assertStringUppercase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === value.toUpperCase()) return
  throw createAssertionError({
    name: 'E_STRING_NOT_UPPERCASE',
    message: 'String is not in uppercase.',
    context: { value },
    schema: { type: 'string', format: 'uppercase' },
  })
}
