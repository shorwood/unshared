/* eslint-disable unicorn/no-null */
import type { ObjectLike } from '@unshared/types'
import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is loosely an object. This means that the value is not `null`
 * and that it is an instance of some class that inherits from `Object`.
 *
 * @param value The value to assert as an object.
 */
export function assertObject<T extends ObjectLike>(value: unknown): asserts value is T {
  if (typeof value === 'object' && value !== null) return
  throw new ValidationError({
    name: 'E_NOT_OBJECT',
    message: 'Value is not an object.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertObjectLike', () => {
    describe('pass', () => {
      it('should pass if value is an object-like', () => {
        const result = assertObject({})
        expect(result).toBeUndefined()
      })

      it('should pass if value is an array', () => {
        const result = assertObject([])
        expect(result).toBeUndefined()
      })

      it('should pass if value is an instance of a class', () => {
        const result = assertObject(new Date())
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is null', () => {
        const shouldThrow = () => assertObject(null)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_OBJECT',
          message: 'Value is not an object.',
          context: { value: null, received: 'null' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as an object-like', () => {
        const value: unknown = {}
        assertObject(value)
        expectTypeOf(value).toEqualTypeOf<ObjectLike>()
      })
    })
  })
}
