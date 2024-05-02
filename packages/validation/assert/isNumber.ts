import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is a number.
 *
 * @param value The value to assert as a number.
 * @throws `ValidationError` if the value is not a number.
 * @example isNumber(1) // void
 */
export function isNumber(value: unknown): asserts value is number {
  if (typeof value === 'number') return
  throw new ValidationError({
    name: 'E_NOT_NUMBER',
    message: `Expected value to be a number but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a number', () => {
    const result = isNumber(1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a number', () => {
    const shouldThrow = () => isNumber('1')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isNumber(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isNumber(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate a number', () => {
    const value = 1 as unknown
    isNumber(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
