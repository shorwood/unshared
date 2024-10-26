/* eslint-disable unicorn/no-null */
import type { ObjectLike } from '@unshared/types'
import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'
import { assertObject } from './assertObject'

/**
 * Assert that a value is strictly an object. This means that the value is neither
 * `null` nor an instance of some class that inherits from `Object`.
 *
 * @param value The value to assert as an object.
 * @throws `ValidationError` if the value is not an object.
 * @example assertObjectStrict({}) // void
 */
export function assertObjectStrict<T extends ObjectLike>(value: unknown): asserts value is T {
  assertObject(value)
  const kind = kindOf(value)
  if (kind === 'object') return
  throw new ValidationError({
    name: 'E_NOT_OBJECT_STRICT',
    message: 'Value is not strictly an object.',
    context: { value, received: kind },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertObject', () => {
    describe('pass', () => {
      it('should pass if value is an object', () => {
        const result = assertObjectStrict({})
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not an object', () => {
        const shouldThrow = () => assertObjectStrict([])
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_OBJECT_STRICT',
          message: 'Value is not strictly an object.',
          context: { value: [], received: 'Array' },
        })
      })

      it('should throw if value is an array', () => {
        const shouldThrow = () => assertObjectStrict([])
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_OBJECT_STRICT',
          message: 'Value is not strictly an object.',
          context: { value: [], received: 'Array' },
        })
      })

      it('should throw if value is an instance of a class', () => {
        const shouldThrow = () => assertObjectStrict(new Date())
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_OBJECT_STRICT',
          message: 'Value is not strictly an object.',
          context: { value: new Date(), received: 'Date' },
        })
      })

      it('should throw if value is null', () => {
        const shouldThrow = () => assertObjectStrict(null)
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
        assertObjectStrict(value)
        expectTypeOf(value).toEqualTypeOf<ObjectLike>()
      })
    })
  })
}
