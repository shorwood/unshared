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
    message: `Expected value to be one of the following values: ${messageValues} but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string is one of the values in an array', () => {
    const result = assertStringEnum('Hello, World!', ['Hello, World!', 'Hello, Universe!'])
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => assertStringEnum(1, ['Hello, World!', 'Hello, Universe!'])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value is not one of the values in an array', () => {
    const shouldThrow = () => assertStringEnum('Hello, World!', ['Hello, Universe!'])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be one of the following values: \'Hello, Universe!\' but received: Hello, World!')
  })

  test('should throw if value is undefined', () => {
    const shouldThrow = () => assertStringEnum(undefined, ['Hello, World!', 'Hello, Universe!'])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringEnum(null, ['Hello, World!', 'Hello, Universe!'])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate a string matching a regular expression', () => {
    const value = 'Hello, World!' as unknown
    assertStringEnum(value, ['Hello, World!', 'Hello, Universe!'])
    expectTypeOf(value).toEqualTypeOf< 'Hello, Universe!' | 'Hello, World!'>()
  })
}
