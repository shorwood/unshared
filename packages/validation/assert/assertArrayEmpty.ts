import { assertArray } from './assertArray'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is an empty array.
 *
 * @param value The value to assert as an empty array.
 * @throws `ValidationError` if the value is not an empty array.
 * @example assertArrayEmpty([]) // void
 */
export function assertArrayEmpty(value: unknown): asserts value is [] {
  assertArray(value)
  if (value.length === 0) return
  throw new ValidationError({
    name: 'E_ARRAY_NOT_EMPTY',
    message: `Expected value to be an empty array but actually received an array with ${value.length} items`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should throw if value is not an array', () => {
    const shouldThrow = () => assertArrayEmpty({})
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: object')
  })

  test('should pass if value is an empty array', () => {
    const result = assertArrayEmpty([])
    expect(result).toBeUndefined()
  })

  test('should throw if value is not an empty array', () => {
    const shouldThrow = () => assertArrayEmpty([1])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an empty array but actually received an array with 1 items')
  })

  test('should predicate an empty array', () => {
    const value = [] as unknown
    assertArrayEmpty(value)
    expectTypeOf(value).toEqualTypeOf<[]>()
  })
}
