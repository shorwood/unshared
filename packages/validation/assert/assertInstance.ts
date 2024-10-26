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
  const expected = ctor.name || 'Unknown'
  throw new ValidationError({
    name: 'E_NOT_INSTANCE_OF',
    message: `Value is not an instance of "${expected}"`,
    context: { expected, received: kindOf(value), ctor },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertInstance', () => {
    describe('pass', () => {
      it('should pass if value is an instance of the given class', () => {
        const result = assertInstance(new Date(), Date)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not an instance of the given class', () => {
        const shouldThrow = () => assertInstance({}, Date)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_INSTANCE_OF',
          message: 'Value is not an instance of "Date"',
          context: { expected: 'Date', received: 'object', ctor: Date },
        })
      })

      it('should throw if value is undefined', () => {
        const shouldThrow = () => assertInstance(undefined, Date)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_INSTANCE_OF',
          message: 'Value is not an instance of "Date"',
          context: { expected: 'Date', received: 'undefined', ctor: Date },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as an instance of the given class', () => {
        const value: unknown = new Date()
        assertInstance(value, Date)
        expectTypeOf(value).toEqualTypeOf<Date>()
      })
    })
  })
}
