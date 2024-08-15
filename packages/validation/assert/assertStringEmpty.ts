import { ValidationError } from '../ValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string and that it is empty. An empty string is a
 * string that has a length of zero or only contains whitespace characters.
 *
 * @param value The value to assert as an empty string.
 * @throws `ValidationError` if the value is not an empty string.
 * @example assertStringEmpty('') // void
 */
export function assertStringEmpty(value: unknown): asserts value is string {
  assertString(value)
  if (value.trim().length === 0) return
  throw new ValidationError({
    name: 'E_STRING_NOT_EMPTY',
    message: 'Expected value to be an empty string but received a non-empty string.',
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  test('should pass if value is an empty string', () => {
    const result = assertStringEmpty('')
    expect(result).toBeUndefined()
  })

  test('should pass if value is a string with only whitespace characters', () => {
    const result = assertStringEmpty(' \n\t ')
    expect(result).toBeUndefined()
  })

  test('should throw if value is a non-empty string', () => {
    const shouldThrow = () => assertStringEmpty('Hello, World!')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an empty string but received a non-empty string.')
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => assertStringEmpty(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertStringEmpty(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringEmpty(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate an empty string', () => {
    const value = '' as unknown
    assertStringEmpty(value)
    expectTypeOf(value).toEqualTypeOf<string>()
  })
}
