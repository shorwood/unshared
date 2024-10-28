import { toPathCase } from '@unshared/string'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in path case.
 *
 * @param value The value to assert as in path case.
 * @throws `ValidationError` if the value is not in path case.
 * @example assertStringPathCase('hello/world') // void
 */
export function assertStringPathCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toPathCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_PATH_CASE',
    message: 'String is not in path case.',
    context: { value },
  })
}
