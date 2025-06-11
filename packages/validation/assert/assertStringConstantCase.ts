import { toConstantCase } from '@unshared/string/toConstantCase'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in constant case.
 *
 * @param value The value to assert as in constant case.
 * @throws `AssertionError` if the value is not in constant case.
 * @example assertStringConstantCase('HELLO_WORLD') // void
 */
export function assertStringConstantCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toConstantCase(value)) return
  throw createAssertionError({
    name: 'E_STRING_NOT_CONSTANT_CASE',
    message: 'String is not in constant case.',
    context: { value },
    schema: { type: 'string', format: 'constant-case' },
  })
}
