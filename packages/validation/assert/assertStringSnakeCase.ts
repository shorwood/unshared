import { toSnakeCase } from '@unshared/string/toSnakeCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in snake case.
 *
 * @param value The value to assert as in snake case.
 * @throws `ValidationError` if the value is not in snake case.
 * @example assertStringSnakeCase('hello_world') // void
 */
export function assertStringSnakeCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toSnakeCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_SNAKE_CASE',
    message: 'String is not in snake case.',
    context: { value },
  })
}
