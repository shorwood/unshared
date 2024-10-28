import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is falsy. Meaning it is either `false`, `0`, `''`, `null` or `undefined`.
 *
 * @param value The value to assert as falsy.
 * @throws `ValidationError` if the value is not falsy.
 * @example assertFalsy(false) // void
 */
export function assertFalsy(value: unknown): asserts value is '' | 0 | false | null | undefined {
  if (!value) return
  throw new ValidationError({
    name: 'E_NOT_FALSY',
    message: 'Value is not falsy.',
    context: { value, received: kindOf(value) },
  })
}
