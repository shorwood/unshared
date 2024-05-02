import { isNumber } from './isNumber'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is strictly a number greater than `0`.
 *
 * @param value The value to assert as a number greater than `0`.
 * @throws `ValidationError` if the value is not a number greater than `0`.
 * @example isNumberPositiveStrict(1) // void
 */
export function isNumberPositiveStrict(value: unknown): asserts value is number {
  isNumber(value)
  if (value > 0) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_POSITIVE_STRICT',
    message: `Expected value to be a number strictly greater than 0 but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a number greater than 0', () => {
    const result = isNumberPositiveStrict(1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a number greater than 0', () => {
    const shouldThrow = () => isNumberPositiveStrict(0)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number strictly greater than 0 but received: 0')
  })

  test('should throw if value is not a number', () => {
    const shouldThrow = () => isNumberPositiveStrict('1')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isNumberPositiveStrict(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isNumberPositiveStrict(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate a number greater than 0', () => {
    const value = 1 as unknown
    isNumberPositiveStrict(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
