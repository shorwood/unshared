import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

// is boolean
/**
 * Assert that a value is a boolean.
 *
 * @param value The value to assert as a boolean.
 * @throws `ValidationError` if the value is not a boolean.
 * @example isBoolean(true) // void
 */
export function isBoolean(value: unknown): asserts value is boolean {
  if (typeof value === 'boolean') return
  throw new ValidationError({
    name: 'E_NOT_BOOLEAN',
    message: `Expected value to be a boolean but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a boolean', () => {
    const result = isBoolean(true)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a boolean', () => {
    const shouldThrow = () => isBoolean(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isBoolean(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isBoolean(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: null')
  })

  test('should predicate a boolean', () => {
    const value = true as unknown
    isBoolean(value)
    expectTypeOf(value).toEqualTypeOf<boolean>()
  })
}
