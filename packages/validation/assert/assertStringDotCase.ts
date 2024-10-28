import { toDotCase } from '@unshared/string/toDotCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in dot case.
 *
 * @param value The value to assert as in dot case.
 * @throws `ValidationError` if the value is not in dot case.
 * @example assertStringDotCase('hello.world') // void
 */
export function assertStringDotCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toDotCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_DOT_CASE',
    message: 'String is not in dot case.',
    context: { value },
  })
}
