import { isNumber } from './isNumber'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is strictly a number less than `0`.
 *
 * @param value The value to assert as a number less than `0`.
 * @throws `ValidationError` if the value is not a number less than `0`.
 * @example isNumberNegativeStrict(-1) // void
 */
export function isNumberNegativeStrict(value: unknown): asserts value is number {
  isNumber(value)
  if (value < 0) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_NEGATIVE_STRICT',
    message: `Expected value to be a number strictly less than 0 but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a number less than 0', () => {
    const result = isNumberNegativeStrict(-1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a number less than 0', () => {
    const shouldThrow = () => isNumberNegativeStrict(0)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number strictly less than 0 but received: 0')
  })

  test('should throw if value is not a number', () => {
    const shouldThrow = () => isNumberNegativeStrict('1')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isNumberNegativeStrict(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isNumberNegativeStrict(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate a number less than 0', () => {
    const value = -1 as unknown
    isNumberNegativeStrict(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
