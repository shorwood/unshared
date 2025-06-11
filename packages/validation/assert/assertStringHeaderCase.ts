import { toHeaderCase } from '@unshared/string/toHeaderCase'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in header case.
 *
 * @param value The value to assert as in header case.
 * @throws `AssertionError` if the value is not in header case.
 * @example assertStringHeaderCase('Hello-World') // void
 */
export function assertStringHeaderCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toHeaderCase(value)) return
  throw createAssertionError({
    name: 'E_STRING_NOT_HEADER_CASE',
    message: 'String is not in header case.',
    context: { value },
    schema: { type: 'string', format: 'header-case' },
  })
}
