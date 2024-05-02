import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is a string.
 *
 * @param value The value to assert as a string.
 * @throws `ValidationError` if the value is not a string.
 * @example isString('Hello, World!') // void
 */
export function isString(value: unknown): asserts value is string {
  if (typeof value === 'string') return
  throw new ValidationError({
    name: 'E_NOT_STRING',
    message: `Expected value to be a string but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string', () => {
    const result = isString('Hello, World!')
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => isString(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isString(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isString(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate a string', () => {
    const value = 'Hello, World!' as unknown
    isString(value)
    expectTypeOf(value).toEqualTypeOf<string>()
  })
}
