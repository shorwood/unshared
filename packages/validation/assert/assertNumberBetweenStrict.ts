import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is strictly between a minimum and maximum value.
 *
 * @param value The value to assert as a number.
 * @param min The lower bound of the range.
 * @param max The upper bound of the range.
 * @throws `ValidationError` if the value is not strictly between the minimum and maximum value.
 * @example assertNumberBetweenStrict(5, 1, 10) // void
 */
export function assertNumberBetweenStrict(value: unknown, min: number, max: number): asserts value is number {
  assertNumber(value)
  if (value > min && value < max) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_BETWEEN_STRICT',
    message: `Expected value to be a number between ${min} and ${max} but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a number between min and max', () => {
    const result = assertNumberBetweenStrict(5, 1, 10)
    expect(result).toBeUndefined()
  })

  test('should throw if value is less than min', () => {
    const shouldThrow = () => assertNumberBetweenStrict(1, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number between 1 and 10 but received: 1')
  })

  test('should throw if value is greater than max', () => {
    const shouldThrow = () => assertNumberBetweenStrict(10, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number between 1 and 10 but received: 10')
  })

  test('should throw if value is equal to min', () => {
    const shouldThrow = () => assertNumberBetweenStrict(1, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number between 1 and 10 but received: 1')
  })

  test('should throw if value is equal to max', () => {
    const shouldThrow = () => assertNumberBetweenStrict(10, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number between 1 and 10 but received: 10')
  })

  test('should throw if value is not a number', () => {
    const shouldThrow = () => assertNumberBetweenStrict('5' as unknown, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    const shouldThrow = () => assertNumberBetweenStrict(undefined, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertNumberBetweenStrict(null, 1, 10)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate a number between min and max', () => {
    const value = 5 as unknown
    assertNumberBetweenStrict(value, 1, 10)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
