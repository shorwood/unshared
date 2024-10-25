import type { NotNil } from '@unshared/types'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is not `null` or `undefined`.
 *
 * @param value The value to assert as not `null` or `undefined`.
 * @throws `ValidationError` if the value is `null` or `undefined`.
 * @example assertNotNil(1) // void
 */
export function assertNotNil<T>(value: T): asserts value is NotNil<T> {
  if (value !== null && value !== undefined) return
  throw new ValidationError({
    name: 'E_IS_NIL',
    message: 'Expected value not to be null or undefined',
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is not null or undefined', () => {
    const result = assertNotNil(1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertNotNil(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value not to be null or undefined')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertNotNil(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value not to be null or undefined')
  })

  test('should predicate the type of a null or undefined value', () => {
    const value = 1 as null | number | undefined
    assertNotNil(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
