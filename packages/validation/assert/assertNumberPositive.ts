import { ValidationError } from '../ValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number greater than or equal to `0`.
 *
 * @param value The value to assert as a number greater than or equal to `0`.
 * @throws `ValidationError` if the value is not a number greater than or equal to `0`.
 * @example assertNumberPositive(1) // void
 */
export function assertNumberPositive(value: unknown): asserts value is number {
  assertNumber(value)
  if (value >= 0) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_POSITIVE',
    message: `Expected value to be a number greater than or equal to 0 but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a number greater than or equal to 0', () => {
    const result = assertNumberPositive(1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a number greater than or equal to 0', () => {
    const shouldThrow = () => assertNumberPositive(-1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number greater than or equal to 0 but received: -1')
  })

  test('should throw if value is not a number', () => {
    const shouldThrow = () => assertNumberPositive('1')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertNumberPositive(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertNumberPositive(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate a number greater than or equal to 0', () => {
    const value = 1 as unknown
    assertNumberPositive(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
