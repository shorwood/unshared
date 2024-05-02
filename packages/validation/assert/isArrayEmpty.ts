import { isArray } from './isArray'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is an empty array.
 *
 * @param value The value to assert as an empty array.
 * @throws `ValidationError` if the value is not an empty array.
 * @example isArrayEmpty([]) // void
 */
export function isArrayEmpty(value: unknown): asserts value is [] {
  isArray(value)
  if (value.length === 0) return
  throw new ValidationError({
    name: 'E_ARRAY_NOT_EMPTY',
    message: `Expected value to be an empty array but actually received an array with ${value.length} items`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is an empty array', () => {
    const result = isArrayEmpty([])
    expect(result).toBeUndefined()
  })

  test('should throw if value is not an empty array', () => {
    const shouldThrow = () => isArrayEmpty([1])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an empty array but actually received an array with 1 items')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isArrayEmpty(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isArrayEmpty(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: null')
  })

  test('should throw if value is not an array', () => {
    const shouldThrow = () => isArrayEmpty({})
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an array but received: object')
  })

  test('should predicate an empty array', () => {
    const value = [] as unknown
    isArrayEmpty(value)
    expectTypeOf(value).toEqualTypeOf<[]>()
  })
}
