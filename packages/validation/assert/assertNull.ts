import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is `null`.
 *
 * @param value The value to assert as `null`.
 * @throws `ValidationError` if the value is not `null`.
 * @example assertNull(null) // void
 */
export function assertNull(value: unknown): asserts value is null {
  if (value === null) return
  throw new ValidationError({
    name: 'E_NOT_NULL',
    message: `Expected value to be null but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = assertNull(null)
    expect(result).toBeUndefined()
  })

  test('should throw if value is an object', () => {
    const shouldThrow = () => assertNull({})
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be null but received: object')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertNull(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be null but received: undefined')
  })

  test('should predicate a null', () => {
    // eslint-disable-next-line unicorn/no-null
    const value = null as unknown
    assertNull(value)
    expectTypeOf(value).toEqualTypeOf<null>()
  })
}
