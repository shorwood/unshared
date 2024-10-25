import type { NotNull } from '@unshared/types'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is not `null`.
 *
 * @param value The value to assert as not `null`.
 * @throws `ValidationError` if the value is `null`.
 * @example assertNotNull(1) // void
 */
export function assertNotNull<T>(value: T): asserts value is NotNull<T> {
  if (value !== null) return
  throw new ValidationError({
    name: 'E_IS_NULL',
    message: 'Expected value not to be null',
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is not null', () => {
    const result = assertNotNull(1)
    expect(result).toBeUndefined()
  })

  test('should pass if the value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = assertNotNull(undefined)
    expect(result).toBeUndefined()
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertNotNull(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value not to be null')
  })

  test('should predicate the type of a null or undefined value', () => {
    const value = 1 as null | number | undefined
    assertNotNull(value)
    expectTypeOf(value).toEqualTypeOf<number | undefined>()
  })
}
