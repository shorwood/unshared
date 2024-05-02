import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is not `null`.
 *
 * @param value The value to assert as not `null`.
 * @throws `ValidationError` if the value is `null`.
 * @example isNotNull(1) // void
 */
export function isNotNull<T = {}>(value: unknown): asserts value is T {
  if (value !== null) return
  throw new ValidationError({
    name: 'E_IS_NULL',
    message: 'Expected value not to be null',
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is not null', () => {
    const result = isNotNull(1)
    expect(result).toBeUndefined()
  })

  test('should pass if the value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = isNotNull(undefined)
    expect(result).toBeUndefined()
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isNotNull(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value not to be null')
  })

  test('should predicate the type of an unknown value', () => {
    const value = 1 as unknown
    isNotNull(value)
    expectTypeOf(value).toEqualTypeOf<{}>()
  })

  test('should predicate the type of an undefined value', () => {

    const value = undefined as number | undefined
    isNotNull(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })

  test('should predicate to a specific type', () => {
    const value = 1 as unknown
    isNotNull<number>(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
