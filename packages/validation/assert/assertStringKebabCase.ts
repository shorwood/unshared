import { toKebabCase } from '@unshared/string/toKebabCase'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in kebab case.
 *
 * @param value The value to assert as in kebab case.
 * @throws `AssertionError` if the value is not in kebab case.
 * @example assertStringKebabCase('hello-world') // void
 */
export function assertStringKebabCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toKebabCase(value)) return
  throw createAssertionError({
    name: 'E_STRING_NOT_KEBAB_CASE',
    message: 'String is not in kebab case.',
    context: { value },
    schema: { type: 'string', format: 'kebab-case' },
  })
}
