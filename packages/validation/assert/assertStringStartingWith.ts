import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that starts the given string.
 *
 * @param value The value to assert as a string starting with the given string.
 * @param start The string to match the start of the value against.
 * @throws `ValidationError` if the value is not a string or does not start with the given string.
 */
export function assertStringStartingWith<T extends string>(value: unknown, start: T): asserts value is `${T}${string}` {
  assertString(value)
  if (value.startsWith(start)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_STARTING_WITH',
    message: `Expected value to be a string starting with "${start}" but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string starting with the given string', () => {
    const result = assertStringStartingWith('Hello, World!', 'Hello')
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => assertStringStartingWith(1, 'Hello')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value does not start with the given string', () => {
    const shouldThrow = () => assertStringStartingWith('Hello, World!', 'World')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string starting with "World" but received: Hello, World!')
  })

  test('should throw if value is undefined', () => {
    const shouldThrow = () => assertStringStartingWith(undefined, 'Hello')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringStartingWith(null, 'Hello')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate a string starting with the given string', () => {
    const value = 'Hello, World!' as unknown
    assertStringStartingWith(value, 'Hello')
    expectTypeOf(value).toEqualTypeOf<`Hello${string}`>()
  })
}
