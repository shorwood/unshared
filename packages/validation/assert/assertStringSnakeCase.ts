import { toSnakeCase } from '@unshared/string/toSnakeCase'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in snake case.
 *
 * @param value The value to assert as in snake case.
 * @throws `AssertionError` if the value is not in snake case.
 * @example assertStringSnakeCase('hello_world') // void
 */
export function assertStringSnakeCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toSnakeCase(value)) return
  throw createAssertionError({
    name: 'E_STRING_NOT_SNAKE_CASE',
    message: 'String is not in snake case.',
    context: { value },
    schema: { type: 'string', format: 'snake-case' },
  })
}
