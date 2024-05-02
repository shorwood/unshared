import { isBoolean } from './isBoolean'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is a boolean equal to `false`.
 *
 * @param value The value to assert as a boolean equal to `false`.
 * @throws `ValidationError` if the value is not a boolean equal to `false`.
 * @example isFalse(false) // void
 */
export function isFalse(value: unknown): asserts value is false {
  isBoolean(value)
  if (value === false) return
  throw new ValidationError({
    name: 'E_BOOLEAN_NOT_FALSE',
    message: `Expected value to be a boolean equal to false but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a boolean equal to false', () => {
    const result = isFalse(false)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a boolean equal to false', () => {
    const shouldThrow = () => isFalse(true)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean equal to false but received: true')
  })

  test('should throw if value is not a boolean', () => {
    const shouldThrow = () => isFalse(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isFalse(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isFalse(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: null')
  })

  test('should predicate a boolean equal to false', () => {
    const value = false as unknown
    isFalse(value)
    expectTypeOf(value).toEqualTypeOf<false>()
  })
}
