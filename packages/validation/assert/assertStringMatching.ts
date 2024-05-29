import { assertString } from './assertString'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is a string that matches a regular expression.
 *
 * @param value The value to assert as a string matching a regular expression.
 * @param exp The regular expression to match the value against.
 * @throws `ValidationError` if the value is not a string or does not match the regular expression.
 * @example assertStringMatching('Hello, World!', /Hello, \w+!/) // void
 */
export function assertStringMatching(value: unknown, exp: RegExp): asserts value is string {
  assertString(value)
  if (exp.test(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_MATCHING_REGULAR_EXPRESSION',
    message: `Expected value to be a string matching the regular expression but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string matching a regular expression', () => {
    const result = assertStringMatching('Hello, World!', /Hello, \w+!/)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => assertStringMatching(1, /Hello, \w+!/)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value does not match the regular expression', () => {
    const shouldThrow = () => assertStringMatching('Hello, World!', /Hello, \d+!/)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string matching the regular expression but received: Hello, World!')
  })

  test('should throw if value is undefined', () => {

    const shouldThrow = () => assertStringMatching(undefined, /Hello, \w+!/)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringMatching(null, /Hello, \w+!/)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate a string matching a regular expression', () => {
    const value = 'Hello, World!' as unknown
    assertStringMatching(value, /Hello, \w+!/)
    expectTypeOf(value).toEqualTypeOf<string>()
  })
}
