import { toPathCase } from '@unshared/string'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in path case.
 *
 * @param value The value to assert as in path case.
 * @throws `AssertionError` if the value is not in path case.
 * @example assertStringPathCase('hello/world') // void
 */
export function assertStringPathCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toPathCase(value)) return
  throw createAssertionError({
    name: 'E_STRING_NOT_PATH_CASE',
    message: 'String is not in path case.',
    context: { value },
    schema: { type: 'string', format: 'path-case' },
  })
}
