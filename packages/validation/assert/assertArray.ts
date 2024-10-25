import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is an array.
 *
 * @param value The value to assert as an array.
 * @throws `ValidationError` if the value is not an array.
 * @example assertArray(['Hello, World!']) // void
 */
export function assertArray<T>(value: unknown): asserts value is T[] {
  if (Array.isArray(value)) return
  throw new ValidationError({
    name: 'E_NOT_ARRAY',
    message: `Expected value to be an array but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is an array', () => {
    const result = assertArray([])
    expect(result).toBeUndefined()
  })

  test('should throw if value is not an array', () => {
    const shouldThrow = () => assertArray({})
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: object')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertArray(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertArray(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: null')
  })

  test('should predicate an array', () => {
    const value = [] as unknown
    assertArray(value)
    expectTypeOf(value).toEqualTypeOf<unknown[]>()
  })

  test('should predicate an array of string if a generic is provided', () => {
    const value = [] as unknown
    assertArray<string>(value)
    expectTypeOf(value).toEqualTypeOf<string[]>()
  })
}
