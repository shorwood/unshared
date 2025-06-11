import { toPascalCase } from '@unshared/string/toPascalCase'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in pascal case.
 *
 * @param value The value to assert as in pascal case.
 * @throws `AssertionError` if the value is not in pascal case.
 * @example assertStringPascalCase('HelloWorld') // void
 */
export function assertStringPascalCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toPascalCase(value)) return
  throw createAssertionError({
    name: 'E_STRING_NOT_PASCAL_CASE',
    message: 'String is not in pascal case.',
    context: { value },
    schema: { type: 'string', format: 'pascal-case' },
  })
}
