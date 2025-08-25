import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that can be parsed as valid JSON.
 *
 * @param value The value to assert as a valid JSON string.
 * @throws `AssertionError` if the value is not a string or cannot be parsed as JSON.
 * @example assertStringJson('{"foo": "bar"}') // void
 */
export function assertStringJson(value: unknown): asserts value is string {
  assertString(value)
  try {
    JSON.parse(value)
  }
  catch (error) {
    throw createAssertionError({
      name: 'E_STRING_NOT_JSON',
      message: 'String is not valid JSON.',
      context: { value, error: error instanceof Error ? error.message : String(error) },
      schema: { type: 'string', format: 'json' },
    })
  }
}
