import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is not `undefined`.
 *
 * @param value The value to assert as not `undefined`.
 * @throws `ValidationError` if the value is `undefined`.
 * @example assertNotUndefined(1) // void
 */
export function assertNotUndefined<T = {}>(value: unknown): asserts value is T {
  if (value !== undefined) return
  throw new ValidationError({
    name: 'E_IS_UNDEFINED',
    message: 'Expected value not to be undefined',
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is not undefined', () => {
    const result = assertNotUndefined(1)
    expect(result).toBeUndefined()
  })

  test('should pass if the value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = assertNotUndefined(null)
    expect(result).toBeUndefined()
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertNotUndefined(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value not to be undefined')
  })

  test('should predicate the type of an unknown value', () => {
    const value = 1 as unknown
    assertNotUndefined(value)
    expectTypeOf(value).toEqualTypeOf<{}>()
  })

  test('should predicate the type of a nullable value', () => {
    const value = 1 as number | undefined
    assertNotUndefined(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })

  test('should predicate to a specific type', () => {
    const value = 1 as unknown
    assertNotUndefined<number>(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
