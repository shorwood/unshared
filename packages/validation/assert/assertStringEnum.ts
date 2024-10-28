import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string is one of the values in an array.
 *
 * @param value The value to assert as a string matching a regular expression.
 * @param values The values to match the value against.
 * @throws `ValidationError` if the value is not a string or does not match the regular expression.
 * @example assertStringEnum('Hello, World!', ['Hello, World!', 'Hello, Universe!']) // void
 */
export function assertStringEnum<T extends string>(value: unknown, values: T[]): asserts value is T {
  assertString(value)
  if (values.includes(value as T)) return
  const messageValues = values.map(x => `'${x}'`).join(', ')
  throw new ValidationError({
    name: 'E_STRING_NOT_ONE_OF_VALUES',
    message: `String is not one of the values: ${messageValues}.`,
    context: { value, values },
  })
}
