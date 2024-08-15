import { ValidationError } from '../ValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is strictly a number less than `0`.
 *
 * @param value The value to assert as a number less than `0`.
 * @throws `ValidationError` if the value is not a number less than `0`.
 * @example assertNumberNegativeStrict(-1) // void
 */
export function assertNumberNegativeStrict(value: unknown): asserts value is number {
  assertNumber(value)
  if (value < 0) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_NEGATIVE_STRICT',
    message: `Expected value to be a number strictly less than 0 but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a number less than 0', () => {
    const result = assertNumberNegativeStrict(-1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a number less than 0', () => {
    const shouldThrow = () => assertNumberNegativeStrict(0)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number strictly less than 0 but received: 0')
  })

  test('should throw if value is not a number', () => {
    const shouldThrow = () => assertNumberNegativeStrict('1')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertNumberNegativeStrict(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertNumberNegativeStrict(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate a number less than 0', () => {
    const value = -1 as unknown
    assertNumberNegativeStrict(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
