import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that strictly equals a given string.
 *
 * @param value The value to assert as a string equal to the given string.
 * @param expected The string to compare the value against.
 * @throws `ValidationError` if the value is not a string or does not equal the expected string.
 * @example assertStringEqual('Hello, World!', 'Hello, World!') // void
 */
export function assertStringEquals<T extends string>(value: unknown, expected: T): asserts value is T {
  assertString(value)
  if (value === expected) return
  throw new ValidationError({
    name: 'E_STRING_NOT_EQUAL',
    message: `Expected value to be a string equal to ${expected} but received: ${value}`,
  })
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should pass if value is a string equal to the expected string', () => {
    const result = assertStringEquals('Hello, World!', 'Hello, World!')
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => assertStringEquals(1, 'Hello, World!')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value does not equal the expected string', () => {
    const shouldThrow = () => assertStringEquals('Hello, World!', 'Hello, World')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string equal to Hello, World but received: Hello, World!')
  })

  test('should throw if value is undefined', () => {
    const shouldThrow = () => assertStringEquals(undefined, 'Hello, World!')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringEquals(null, 'Hello, World!')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate a string equal to the expected string', () => {
    const value = 'Hello, World!' as unknown
    assertStringEquals(value, 'Hello, World!')
    expectTypeOf(value).toEqualTypeOf<'Hello, World!'>()
  })
}
