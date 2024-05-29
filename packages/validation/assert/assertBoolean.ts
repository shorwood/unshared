import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

// is boolean
/**
 * Assert that a value is a boolean.
 *
 * @param value The value to assert as a boolean.
 * @throws `ValidationError` if the value is not a boolean.
 * @example assertBoolean(true) // void
 */
export function assertBoolean(value: unknown): asserts value is boolean {
  if (typeof value === 'boolean') return
  throw new ValidationError({
    name: 'E_NOT_BOOLEAN',
    message: `Expected value to be a boolean but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a boolean', () => {
    const result = assertBoolean(true)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a boolean', () => {
    const shouldThrow = () => assertBoolean(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertBoolean(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertBoolean(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a boolean but received: null')
  })

  test('should predicate a boolean', () => {
    const value = true as unknown
    assertBoolean(value)
    expectTypeOf(value).toEqualTypeOf<boolean>()
  })
}
