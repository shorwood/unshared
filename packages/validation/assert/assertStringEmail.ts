import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/** Regular expression that matches an email address. */
export const EXP_EMAIL = /^[\w!#$%&'*+./=?^`{|}~-]+@[\da-z](?:[\da-z-]{0,61}[\da-z])?(?:\.[\da-z](?:[\da-z-]{0,61}[\da-z])?)*$/i

/** A string that must contain an `@` character. */
export type Email = `${string}@${string}`

/**
 * Assert that a value is a string and that it matches an email pattern as
 * specified by [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322).
 *
 * @param value The value to assert as an email.
 * @throws `ValidationError` if the value is not an email.
 * @example assertStringEmail('john.doe@acme.com') // void
 */
export function assertStringEmail(value: unknown): asserts value is Email {
  assertString(value)
  if (EXP_EMAIL.test(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_EMAIL',
    message: 'String is not an email.',
    context: { value },
  })
}
