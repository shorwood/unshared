import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is `undefined`.
 *
 * @param value The value to assert as `undefined`.
 * @throws `ValidationError` if the value is not `undefined`.
 * @example assertUndefined(undefined) // void
 */
export function assertUndefined(value: unknown): asserts value is undefined {
  if (value === undefined) return
  throw new ValidationError({
    name: 'E_NOT_UNDEFINED',
    message: `Expected value to be undefined but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = assertUndefined(undefined)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not undefined', () => {
    const shouldThrow = () => assertUndefined(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be undefined but received: number')
  })

  test('should throw if value is not undefined', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertUndefined(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be undefined but received: null')
  })

  test('should predicate an undefined', () => {
    const value = undefined as unknown
    assertUndefined(value)
    expectTypeOf(value).toEqualTypeOf<undefined>()
  })
}
