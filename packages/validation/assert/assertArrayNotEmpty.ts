import { ValidationError } from '../createValidationError'
import { assertArray } from './assertArray'

/**
 * Assert that a value is a non-empty array.
 *
 * @param value The value to assert as a non-empty array.
 * @throws `ValidationError` if the value is not a non-empty array.
 * @example assertArrayNotEmpty(['Hello, World!']) // void
 */
export function assertArrayNotEmpty<T>(value: unknown): asserts value is T[] {
  assertArray(value)
  if (value.length > 0) return
  throw new ValidationError({
    name: 'E_ARRAY_EMPTY',
    message: 'Expected value to be a non-empty array but received an empty array.',
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a non-empty array', () => {
    const result = assertArrayNotEmpty([1])
    expect(result).toBeUndefined()
  })

  test('should throw if value is an empty array', () => {
    const shouldThrow = () => assertArrayNotEmpty([])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a non-empty array but received an empty array.')
  })

  test('should throw if value is not an array', () => {
    const shouldThrow = () => assertArrayNotEmpty({})
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: object')
  })

  test('should predicate a non-empty array', () => {
    const value = [1] as unknown
    assertArrayNotEmpty(value)
    expectTypeOf(value).toEqualTypeOf<unknown[]>()
  })

  test('should predicate a non-empty array of string if a generic is provided', () => {
    const value = ['Hello, World!'] as unknown
    assertArrayNotEmpty<string>(value)
    expectTypeOf(value).toEqualTypeOf<string[]>()
  })
}
