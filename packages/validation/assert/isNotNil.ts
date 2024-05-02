import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is not `null` or `undefined`.
 *
 * @param value The value to assert as not `null` or `undefined`.
 * @throws `ValidationError` if the value is `null` or `undefined`.
 * @example isNotNil(1) // void
 */
export function isNotNil<T = {}>(value: unknown): asserts value is T {
  if (value !== null && value !== undefined) return
  throw new ValidationError({
    name: 'E_IS_NIL',
    message: 'Expected value not to be null or undefined',
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is not null or undefined', () => {
    const result = isNotNil(1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isNotNil(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value not to be null or undefined')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isNotNil(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value not to be null or undefined')
  })

  test('should predicate the type of an unknown value', () => {
    const value = 1 as unknown
    isNotNil(value)
    expectTypeOf(value).toEqualTypeOf<{}>()
  })

  test('should predicate to a specific type', () => {
    const value = 1 as unknown
    isNotNil<number>(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
