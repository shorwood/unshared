import { isNumber } from './isNumber'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is an integer number.
 *
 * @param value The value to assert as an integer number.
 * @throws `ValidationError` if the value is not an integer number.
 * @example isNumberInteger(1) // void
 */
export function isNumberInteger(value: unknown): asserts value is number {
  isNumber(value)
  if (!Number.isSafeInteger(value)) {
    throw new ValidationError({
      name: 'E_NUMBER_NOT_INTEGER',
      message: `Expected value to be an integer number but received decimal value: ${value}`,
    })
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is an integer number', () => {
    const result = isNumberInteger(1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is a string', () => {
    const shouldThrow = () => isNumberInteger('1')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is not an integer number', () => {
    const shouldThrow = () => isNumberInteger(1.1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an integer number but received decimal value: 1.1')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isNumberInteger(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isNumberInteger(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate an integer number', () => {
    const value = 1 as unknown
    isNumberInteger(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
