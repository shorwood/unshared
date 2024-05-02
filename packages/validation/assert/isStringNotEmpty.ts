import { isString } from './isString'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is a string and that it is not empty. An empty string
 * is a string that has a length of zero or only contains whitespace characters.
 *
 * @param value The value to assert as a non-empty string.
 * @throws `ValidationError` if the value is not a non-empty string.
 * @example isStringNotEmpty('Hello, World!') // void
 */
export function isStringNotEmpty(value: unknown): asserts value is string {
  isString(value)
  if (value.trim().length > 0) return
  throw new ValidationError({
    name: 'E_STRING_EMPTY',
    message: 'Expected value to be a non-empty string but received an empty string.',
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  test('should pass if value is a non-empty string', () => {
    const result = isStringNotEmpty('Hello, World!')
    expect(result).toBeUndefined()
  })

  test('should throw if value is an empty string', () => {
    const shouldThrow = () => isStringNotEmpty('')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string.')
  })

  test('should throw if value is a string with only whitespace characters', () => {
    const shouldThrow = () => isStringNotEmpty(' \n\t ')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string.')
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => isStringNotEmpty(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isStringNotEmpty(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isStringNotEmpty(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate a non-empty string', () => {
    const value = 'Hello, World!' as unknown
    isStringNotEmpty(value)
    expectTypeOf(value).toEqualTypeOf<string>()
  })
}
