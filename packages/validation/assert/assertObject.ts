import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is an object.
 *
 * @param value The value to assert as an object.
 * @throws `ValidationError` if the value is not an object.
 * @example assertObject({}) // void
 */
export function assertObject<T extends object>(value: unknown): asserts value is T {
  if (kindOf(value) === 'object') return
  throw new ValidationError({
    name: 'E_NOT_OBJECT',
    message: `Expected value to be an object but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is an object', () => {
    const result = assertObject({})
    expect(result).toBeUndefined()
  })

  test('should throw if value is not an object', () => {
    const shouldThrow = () => assertObject([])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an object but received: Array')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertObject(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an object but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertObject(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an object but received: null')
  })

  test('should predicate an object', () => {
    const value = {} as unknown
    assertObject(value)
    expectTypeOf(value).toEqualTypeOf<object>()
  })

  test('should predicate an object of Record<string, unknown> if a generic is provided', () => {
    const value = {} as unknown
    assertObject<Record<string, unknown>>(value)
    expectTypeOf(value).toEqualTypeOf<Record<string, unknown>>()
  })
}
