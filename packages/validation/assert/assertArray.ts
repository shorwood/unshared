/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { kindOf } from '@unshared/functions/kindOf'
import { createValidationError } from '../createValidationError'

/**
 * Assert that a value is an array.
 *
 * @param value The value to assert as an array.
 * @throws `ValidationError` if the value is not an array.
 * @example assertArray(['Hello, World!']) // void
 */
export function assertArray<T>(value: unknown): asserts value is T[] {
  if (Array.isArray(value)) return
  throw createValidationError({
    name: 'E_NOT_ARRAY',
    message: 'Value is not an array.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertArray', () => {
    describe('pass', () => {
      it('should pass if value is an array', () => {
        const result = assertArray([])
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is an object', () => {
        const shouldThrow = () => assertArray({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_ARRAY',
          message: 'Value is not an array.',
          context: { value: {}, received: 'object' },
        })
      })

      it('should throw if value is undefined', () => {
        const shouldThrow = () => assertArray(undefined)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_ARRAY',
          message: 'Value is not an array.',
          context: { value: undefined, received: 'undefined' },
        })
      })

      it('should throw if value is null', () => {
        const shouldThrow = () => assertArray(null)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_ARRAY',
          message: 'Value is not an array.',
          context: { value: null, received: 'null' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate an array', () => {
        const value = [] as unknown
        assertArray(value)
        expectTypeOf(value).toEqualTypeOf<unknown[]>()
      })

      it('should predicate an array of string if a generic is provided', () => {
        const value = [] as unknown
        assertArray<string>(value)
        expectTypeOf(value).toEqualTypeOf<string[]>()
      })
    })
  })
}
