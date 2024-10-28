import { toConstantCase } from '@unshared/string/toConstantCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in constant case.
 *
 * @param value The value to assert as in constant case.
 * @throws `ValidationError` if the value is not in constant case.
 * @example assertStringConstantCase('HELLO_WORLD') // void
 */
export function assertStringConstantCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toConstantCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_CONSTANT_CASE',
    message: 'String is not in constant case.',
    context: { value },
  })
}
