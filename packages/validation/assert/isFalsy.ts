import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is falsy. Meaning it is either `false`, `0`, `''`, `null` or `undefined`.
 *
 * @param value The value to assert as falsy.
 * @throws `ValidationError` if the value is not falsy.
 * @example isFalsy(false) // void
 */
export function isFalsy(value: unknown): asserts value is '' | 0 | false | null | undefined {
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
    const result = isFalsy(false)
    expect(result).toBeUndefined()
  })

  test('should pass if value is 0', () => {
    const result = isFalsy(0)
    expect(result).toBeUndefined()
  })

  test('should pass if value is an empty string', () => {
    const result = isFalsy('')
    expect(result).toBeUndefined()
  })

  test('should pass if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = isFalsy(null)
    expect(result).toBeUndefined()
  })

  test('should pass if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = isFalsy(undefined)
    expect(result).toBeUndefined()
  })

  test('should throw if value is a non-zero number', () => {
    const shouldThrow = () => isFalsy(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: 1')
  })

  test('should throw if value is a non-empty string', () => {
    const shouldThrow = () => isFalsy('hello')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: hello')
  })

  test('should throw if value is true', () => {
    const shouldThrow = () => isFalsy(true)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: true')
  })

  test('should throw if value is an object', () => {
    const shouldThrow = () => isFalsy({})
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: [object Object]')
  })

  test('should throw if value is an array', () => {
    const shouldThrow = () => isFalsy([])
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be falsy but received: ')
  })

  test('should predicate a falsy value', () => {
    const value = false as unknown
    isFalsy(value)
    expectTypeOf(value).toEqualTypeOf<'' | 0 | false | null | undefined>()
  })
}
