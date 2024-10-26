/* eslint-disable unicorn/no-null */
import type { ObjectLike } from '@unshared/types'
import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is an object.
 *
 * @param value The value to assert as an object.
 * @throws `ValidationError` if the value is not an object.
 * @example assertObject({}) // void
 */
export function assertObject<T extends ObjectLike>(value: unknown): asserts value is T {
  const kind = kindOf(value)
  if (kind === 'object') return
  throw new ValidationError({
    name: 'E_NOT_OBJECT',
    message: 'Value is not an object.',
    context: { value, received: kind },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertObject', () => {
    describe('pass', () => {
      it('should pass if value is an object', () => {
        const result = assertObject({})
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not an object', () => {
        const shouldThrow = () => assertObject([])
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_OBJECT',
          message: 'Value is not an object.',
          context: { value: [], received: 'Array' },
        })
      })

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
      it('should predicate value as an object', () => {
        const value: unknown = {}
        assertObject(value)
        expectTypeOf(value).toEqualTypeOf<ObjectLike>()
      })
    })
  })
}
