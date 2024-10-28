import { toHeaderCase } from '@unshared/string/toHeaderCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in header case.
 *
 * @param value The value to assert as in header case.
 * @throws `ValidationError` if the value is not in header case.
 * @example assertStringHeaderCase('Hello-World') // void
 */
export function assertStringHeaderCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toHeaderCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_HEADER_CASE',
    message: 'String is not in header case.',
    context: { value },
  })
}
