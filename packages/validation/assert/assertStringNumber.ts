import { assertString } from './assertString'
import { ValidationError } from '../ValidationError'

// assertStringNumber.ts
/** Regular expression that matches a string representation of a number. */
const EXP_NUMBER = /^[+-]?\d+(?:\.\d+)?$/

/**
 * Assert that a value is a string and can be converted to a number.
 *
 * @param value The value to assert as a string number.
 * @throws `ValidationError` if the value is not a string number.
 * @example assertStringNumber('5') // void
 */
export function assertStringNumber(value: unknown): asserts value is `${number}` {
  assertString(value)
  if (EXP_NUMBER.test(value)) return
  throw new ValidationError({
    name: 'E_NOT_STRING_NUMBER',
    message: `Expected value to be a string representation of a number but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string number', () => {
    const result = assertStringNumber('5')
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a string number', () => {
    const shouldThrow = () => assertStringNumber('Hello, World!')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string representation of a number but received: Hello, World!')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertStringNumber(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringNumber(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate a string number', () => {
    const value = '5' as unknown
    assertStringNumber(value)
    expectTypeOf(value).toEqualTypeOf<`${number}`>()
  })
}
