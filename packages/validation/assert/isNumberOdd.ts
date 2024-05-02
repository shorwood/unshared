import { isNumberInteger } from './isNumberInteger'
import { isNumber } from './isNumber'
import { ValidationError } from '../ValidationError'

/**
 * Obligatory meme function to assert if a value is an odd number.
 *
 * @param value The value to assert as an odd number.
 * @throws `ValidationError` if the value is not an odd number.
 * @example isNumberOdd(1) // true
 */
export function isNumberOdd(value: unknown): asserts value is number {
  isNumber(value)
  isNumberInteger(value)
  if ((value & 0x1) === 0) {
    throw new ValidationError({
      name: 'E_NUMBER_NOT_ODD',
      message: `Expected value to be an odd number but received: ${value}`,
    })
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is an odd number', () => {
    const result = isNumberOdd(1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is an even number', () => {
    const shouldThrow = () => isNumberOdd(2)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an odd number but received: 2')
  })

  test('should throw if value is a decimal number', () => {
    const shouldThrow = () => isNumberOdd(2.1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an integer number but received decimal value: 2.1')
  })

  test('should throw if value is a string', () => {
    const shouldThrow = () => isNumberOdd('1')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => isNumberOdd(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => isNumberOdd(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate an odd number', () => {
    const value = 1 as unknown
    isNumberOdd(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
