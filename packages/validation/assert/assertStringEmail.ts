import { assertString } from './assertString'
import { ValidationError } from '../ValidationError'

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
    message: `Expected value to be an email but received: ${value}`,
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  test('should pass if value is an email', () => {
    const result = assertStringEmail('john.doe@acme.com')
    expect(result).toBeUndefined()
  })

  test('should throw if value is not an email', () => {
    const shouldThrow = () => assertStringEmail('john.doe@')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an email but received: john.doe@')
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => assertStringEmail(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertStringEmail(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringEmail(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate an email', () => {
    const value = 'john.doe@acme.com' as unknown
    assertStringEmail(value)
    expectTypeOf(value).toEqualTypeOf<`${string}@${string}`>()
  })
}
