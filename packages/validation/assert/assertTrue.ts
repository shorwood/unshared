import { ValidationError } from '../ValidationError'
import { assertBoolean } from './assertBoolean'

/**
 * Assert that a value is a boolean equal to `true`.
 *
 * @param value The value to assert as a boolean equal to `true`.
 * @throws `ValidationError` if the value is not a boolean equal to `true`.
 * @example assertTrue(true) // void
 */
export function assertTrue(value: unknown): asserts value is true {
  assertBoolean(value)
  if (value === true) return
  throw new ValidationError({
    name: 'E_BOOLEAN_NOT_TRUE',
    message: `Expected value to be a boolean equal to true but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a boolean equal to true', () => {
    const result = assertTrue(true)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a boolean equal to true', () => {
    const shouldThrow = () => assertTrue(false)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean equal to true but received: false')
  })

  test('should throw if value is not a boolean', () => {
    const shouldThrow = () => assertTrue(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertTrue(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertTrue(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: null')
  })

  test('should predicate a boolean equal to true', () => {
    const value = true as unknown
    assertTrue(value)
    expectTypeOf(value).toEqualTypeOf<true>()
  })
}
