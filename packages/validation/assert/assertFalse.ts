import { ValidationError } from '../createValidationError'
import { assertBoolean } from './assertBoolean'

/**
 * Assert that a value is a boolean equal to `false`.
 *
 * @param value The value to assert as a boolean equal to `false`.
 * @throws `ValidationError` if the value is not a boolean equal to `false`.
 * @example assertFalse(false) // void
 */
export function assertFalse(value: unknown): asserts value is false {
  assertBoolean(value)
  if (value === false) return
  throw new ValidationError({
    name: 'E_BOOLEAN_NOT_FALSE',
    message: `Expected value to be a boolean equal to false but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a boolean equal to false', () => {
    const result = assertFalse(false)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a boolean equal to false', () => {
    const shouldThrow = () => assertFalse(true)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean equal to false but received: true')
  })

  test('should throw if value is not a boolean', () => {
    const shouldThrow = () => assertFalse(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertFalse(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertFalse(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: null')
  })

  test('should predicate a boolean equal to false', () => {
    const value = false as unknown
    assertFalse(value)
    expectTypeOf(value).toEqualTypeOf<false>()
  })
}
