import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is falsy. Meaning it is either `false`, `0`, `''`, `null` or `undefined`.
 *
 * @param value The value to assert as falsy.
 * @throws `ValidationError` if the value is not falsy.
 * @example assertFalsy(false) // void
 */
export function assertFalsy(value: unknown): asserts value is '' | 0 | false | null | undefined {
  if (value) {
    throw new ValidationError({
      name: 'E_NOT_FALSY',
      message: `Expected value to be falsy but received: ${kindOf(value)}`,
    })
  }
}

/* v8 ignore end */
if (import.meta.vitest) {
  test('should pass if value is a boolean equal to false', () => {
    const result = assertFalsy(false)
    expect(result).toBeUndefined()
  })

  test('should pass if value is 0', () => {
    const result = assertFalsy(0)
    expect(result).toBeUndefined()
  })

  test('should pass if value is an empty string', () => {
    const result = assertFalsy('')
    expect(result).toBeUndefined()
  })

  test('should pass if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = assertFalsy(null)
    expect(result).toBeUndefined()
  })

  test('should pass if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = assertFalsy(undefined)
    expect(result).toBeUndefined()
  })

  test('should throw if value is a non-zero number', () => {
    const shouldThrow = () => assertFalsy(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: number')
  })

  test('should throw if value is a non-empty string', () => {
    const shouldThrow = () => assertFalsy('hello')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: string')
  })

  test('should throw if value is true', () => {
    const shouldThrow = () => assertFalsy(true)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: boolean')
  })

  test('should throw if value is an object', () => {
    const shouldThrow = () => assertFalsy({})
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: object')
  })

  test('should throw if value is an array', () => {
    const shouldThrow = () => assertFalsy([])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: Array')
  })

  test('should predicate a falsy value', () => {
    const value = false as unknown
    assertFalsy(value)
    expectTypeOf(value).toEqualTypeOf<'' | 0 | false | null | undefined>()
  })
}
