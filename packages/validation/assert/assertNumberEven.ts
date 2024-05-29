import { assertNumberInteger } from './assertNumberInteger'
import { assertNumber } from './assertNumber'
import { ValidationError } from '../ValidationError'

/**
 * Obligatory meme function to assert if a value is an even number.
 *
 * @param value The value to assert as an even number.
 * @throws `ValidationError` if the value is not an even number.
 * @example assertNumberEven(2) // true
 */
export function assertNumberEven(value: unknown): asserts value is number {
  assertNumber(value)
  assertNumberInteger(value)
  if ((value & 1) !== 0) {
    throw new ValidationError({
      name: 'E_NUMBER_NOT_EVEN',
      message: `Expected value to be an even number but received: ${value}`,
    })
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is an even number', () => {
    const result = assertNumberEven(2)
    expect(result).toBeUndefined()
  })

  test('should throw if value is an odd number', () => {
    const shouldThrow = () => assertNumberEven(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an even number but received: 1')
  })

  test('should throw if value is a decimal number', () => {
    const shouldThrow = () => assertNumberEven(2.1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an integer number but received decimal value: 2.1')
  })

  test('should throw if value is a string', () => {
    const shouldThrow = () => assertNumberEven('1')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertNumberEven(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertNumberEven(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate an even number', () => {
    const value = 2 as unknown
    assertNumberEven(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
