import { toTitleCase } from '@unshared/string/toTitleCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in title case.
 *
 * @param value The value to assert as in title case.
 * @throws `ValidationError` if the value is not in title case.
 * @example assertStringTitleCase('Hello World') // void
 */
export function assertStringTitleCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toTitleCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_TITLE_CASE',
    message: 'String is not in title case.',
    context: { value },
  })
}
