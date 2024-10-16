import type { Function } from '@unshared/types'
import { kindOf } from '@unshared/functions'
import { ValidationError } from '../ValidationError'

/**
 * Assert that a value is a function.
 *
 * @param value The value to assert as a function.
 * @throws `ValidationError` if the value is not a function.
 * @example assertFunction(() => {}) // void
 */
export function assertFunction<T extends Function>(value: unknown): asserts value is T {
  if (typeof value === 'function') return
  throw new ValidationError({
    name: 'E_NOT_FUNCTION',
    message: `Expected value to be a function but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a function', () => {
    const result = assertFunction(() => {})
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a function', () => {
    const shouldThrow = () => assertFunction(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a function but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertFunction(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a function but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertFunction(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a function but received: null')
  })

  test('should predicate a function', () => {
    const value = (() => {}) as unknown
    assertFunction(value)
    expectTypeOf(value).toEqualTypeOf<(...args: any[]) => any>()
  })

  test('should predicate the given function type', () => {
    const value = (() => {}) as unknown
    assertFunction<() => void>(value)
    expectTypeOf(value).toEqualTypeOf<() => void>()
  })
}
