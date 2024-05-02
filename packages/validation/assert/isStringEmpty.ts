import { isString } from './isString'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is a string and that it is empty. An empty string is a
 * string that has a length of zero or only contains whitespace characters.
 *
 * @param value The value to assert as an empty string.
 * @throws `ValidationError` if the value is not an empty string.
 * @example isStringEmpty('') // void
 */
export function isStringEmpty(value: unknown): asserts value is string {
  isString(value)
  if (value.trim().length === 0) return
  throw new ValidationError({
    name: 'E_STRING_NOT_EMPTY',
    message: 'Expected value to be an empty string but received a non-empty string.',
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  test('should pass if value is an empty string', () => {
    const result = isStringEmpty('')
    expect(result).toBeUndefined()
  })

  test('should pass if value is a string with only whitespace characters', () => {
    const result = isStringEmpty(' \n\t ')
    expect(result).toBeUndefined()
  })

  test('should throw if value is a non-empty string', () => {
    const shouldThrow = () => isStringEmpty('Hello, World!')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an empty string but received a non-empty string.')
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => isStringEmpty(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isStringEmpty(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isStringEmpty(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate an empty string', () => {
    const value = '' as unknown
    isStringEmpty(value)
    expectTypeOf(value).toEqualTypeOf<string>()
  })
}
