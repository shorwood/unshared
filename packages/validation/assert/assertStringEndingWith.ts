import { assertString } from './assertString'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is a string that ends with the given string.
 *
 * @param value The value to assert as a string ending with the given string.
 * @param end The string to match the end of the value against.
 * @throws `ValidationError` if the value is not a string or does not end with the given string.
 * @example assertStringEndingWith('Hello, World!', 'World!') // void
 */

export function assertStringEndingWith<T extends string>(value: unknown, end: T): asserts value is `${string}${T}` {
  assertString(value)
  if (value.endsWith(end)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_ENDING_WITH',
    message: `Expected value to be a string ending with "${end}" but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string ending with the given string', () => {
    const result = assertStringEndingWith('Hello, World!', 'World!')
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => assertStringEndingWith(1, 'World!')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value does not end with the given string', () => {
    const shouldThrow = () => assertStringEndingWith('Hello, World!', 'Hello')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string ending with "Hello" but received: Hello, World!')
  })

  test('should throw if value is undefined', () => {
    const shouldThrow = () => assertStringEndingWith(undefined, 'World!')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringEndingWith(null, 'World!')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate a string ending with the given string', () => {
    const value = 'Hello, World!' as unknown
    assertStringEndingWith(value, 'World!')
    expectTypeOf(value).toEqualTypeOf<`${string}World!`>()
  })
}
