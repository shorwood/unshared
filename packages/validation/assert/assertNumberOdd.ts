import { ValidationError } from '../ValidationError'
import { assertNumber } from './assertNumber'
import { assertNumberInteger } from './assertNumberInteger'

/**
 * Obligatory meme function to assert if a value is an odd number.
 *
 * @param value The value to assert as an odd number.
 * @throws `ValidationError` if the value is not an odd number.
 * @example assertNumberOdd(1) // true
 */
export function assertNumberOdd(value: unknown): asserts value is number {
  assertNumber(value)
  assertNumberInteger(value)
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
    const result = assertNumberOdd(1)
    expect(result).toBeUndefined()
  })

  test('should throw if value is an even number', () => {
    const shouldThrow = () => assertNumberOdd(2)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an odd number but received: 2')
  })

  test('should throw if value is a decimal number', () => {
    const shouldThrow = () => assertNumberOdd(2.1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an integer number but received decimal value: 2.1')
  })

  test('should throw if value is a string', () => {
    const shouldThrow = () => assertNumberOdd('1')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: string')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertNumberOdd(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertNumberOdd(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a number but received: null')
  })

  test('should predicate an odd number', () => {
    const value = 1 as unknown
    assertNumberOdd(value)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
}
