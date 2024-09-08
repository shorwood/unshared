import { toConstantCase } from '@unshared/string/toConstantCase'
import { ValidationError } from '../ValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it matches in constant case pattern as
 * specified by [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322).
 *
 * @param value The value to assert as in constant case.
 * @throws `ValidationError` if the value is not in constant case.
 * @example assertStringConstantCase('john.doe@acme.com') // void
 */
export function assertStringConstantCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toConstantCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_CONSTANT_CASE',
    message: `Expected value to be a string in constant case but received: ${value}`,
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  test('should pass if value is in constant case', () => {
    const result = assertStringConstantCase('FOO_BAR')
    expect(result).toBeUndefined()
  })

  test('should throw if value is not in constant case', () => {
    const shouldThrow = () => assertStringConstantCase('foo.bar')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string in constant case but received: foo.bar')
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => assertStringConstantCase(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertStringConstantCase(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringConstantCase(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate in constant case', () => {
    const value = 'FOO_BAR' as unknown
    assertStringConstantCase(value)
    expectTypeOf(value).toEqualTypeOf<string>()
  })
}
