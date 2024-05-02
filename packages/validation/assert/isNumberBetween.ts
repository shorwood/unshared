import { isNumber } from './isNumber'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is a number between or equal a minimum and maximum value.
 *
 * @param value The value to assert as a number.
 * @param min The minimum value that the number can be.
 * @param max The maximum value that the number can be.
 */
export function isNumberBetween(value: unknown, min: number, max: number): asserts value is number {
  isNumber(value)
  if (value >= min && value <= max) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_BETWEEN',
    message: `Expected value to be a number between ${min} and ${max} but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a number between min and max', () => {
    const result = isNumberBetween(5, 1, 10)
    expect(result).toBeUndefined()
  })

  test('should pass if value is equal to min', () => {
    const result = isNumberBetween(1, 1, 10)
    expect(result).toBeUndefined()
  })

  test('should pass if value is equal to max', () => {
    const result = isNumberBetween(10, 1, 10)
    expect(result).toBeUndefined()
  })

  test('should throw if value is less than min', () => {
    const shouldThrow = () => isNumberBetween(0, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number between 1 and 10 but received: 0')
  })

  test('should throw if value is greater than max', () => {
    const shouldThrow = () => isNumberBetween(11, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number between 1 and 10 but received: 11')
  })

  test('should throw if value is not a number', () => {
    const shouldThrow = () => isNumberBetween('5' as unknown, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    const shouldThrow = () => isNumberBetween(undefined, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isNumberBetween(null, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate a number between min and max', () => {
    const value = 5 as unknown
    isNumberBetween(value, 1, 10)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
