import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is an array.
 *
 * @param value The value to assert as an array.
 * @throws `ValidationError` if the value is not an array.
 * @example isArray(['Hello, World!']) // void
 */
export function isArray<T>(value: unknown): asserts value is T[] {
  if (Array.isArray(value)) return
  throw new ValidationError({
    name: 'E_NOT_ARRAY',
    message: `Expected value to be an array but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is an array', () => {
    const result = isArray([])
    expect(result).toBeUndefined()
  })

  test('should throw if value is not an array', () => {
    const shouldThrow = () => isArray({})
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: object')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isArray(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isArray(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: null')
  })

  test('should predicate an array', () => {
    const value = [] as unknown
    isArray(value)
    expectTypeOf(value).toEqualTypeOf<unknown[]>()
  })

  test('should predicate an array of string if a generic is provided', () => {
    const value = [] as unknown
    isArray<string>(value)
    expectTypeOf(value).toEqualTypeOf<string[]>()
  })
}
