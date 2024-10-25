import type { Constructor } from '@unshared/types'
import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is an instance of the given class.
 *
 * @param value The value to assert as an instance of the given class.
 * @param ctor The class to assert the value is an instance of.
 * @throws `ValidationError` if the value is not an instance of the given class.
 * @example assertInstance(new Date(), Date) // void
 */
export function assertInstance<T extends object>(value: unknown, ctor: Constructor<T>): asserts value is T {
  if (value instanceof ctor) return
  throw new ValidationError({
    name: 'E_NOT_INSTANCE_OF',
    message: `Expected value to be an instance of ${ctor.name} but received: ${kindOf(value)}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is an instance of the given class', () => {
    const result = assertInstance(new Date(), Date)
    expect(result).toBeUndefined()
  })

  test('should throw if value is not an instance of the given class', () => {
    const shouldThrow = () => assertInstance([], Date)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an instance of Date but received: Array')
  })

  test('should throw if value is undefined', () => {
    const shouldThrow = () => assertInstance(undefined, Date)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an instance of Date but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertInstance(null, Date)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be an instance of Date but received: null')
  })

  test('should predicate an instance of the given class', () => {
    const value = new Date() as unknown
    assertInstance(value, Date)
    expectTypeOf(value).toEqualTypeOf<Date>()
  })

  test('should predicate an instance of the given class if a generic is provided', () => {
    const value = new Date() as unknown
    assertInstance<Date>(value, Date)
    expectTypeOf(value).toEqualTypeOf<Date>()
  })
}
