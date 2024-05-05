import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is `null` or `undefined`.
 *
 * @param value The value to assert as `null` or `undefined`.
 * @throws `ValidationError` if the value is neither `null` nor `undefined`.
 * @example isNil(null) // void
 */
export function isNil(value: unknown): asserts value is null | undefined {
  if (value === null || value === undefined) return
  throw new ValidationError({
    name: 'E_NOT_NIL',
    message: `Expected value to be null or undefined but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = isNil(null)
    expect(result).toBeUndefined()
  })

  test('should pass if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = isNil(undefined)
    expect(result).toBeUndefined()
  })

  test('should throw if value is an object', () => {
    const shouldThrow = () => isNil({})
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be null or undefined but received: object')
  })

  test('should predicate a null or undefined union', () => {
    // eslint-disable-next-line unicorn/no-null
    const value = null as unknown
    isNil(value)
    expectTypeOf(value).toEqualTypeOf<null | undefined>()
  })
}
