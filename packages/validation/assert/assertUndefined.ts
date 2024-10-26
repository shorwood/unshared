/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is `undefined`.
 *
 * @param value The value to assert as `undefined`.
 * @throws `ValidationError` if the value is not `undefined`.
 * @example assertUndefined(undefined) // void
 */
export function assertUndefined(value: unknown): asserts value is undefined {
  if (value === undefined) return
  throw new ValidationError({
    name: 'E_NOT_UNDEFINED',
    message: 'Value is not undefined.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertUndefined', () => {
    describe('pass', () => {
      it('should pass if value is undefined', () => {
        const result = assertUndefined(undefined)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not undefined', () => {
        const shouldThrow = () => assertUndefined({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_UNDEFINED',
          message: 'Value is not undefined.',
          context: { value: {}, received: 'object' },
        })
      })

      it('should throw if value is null', () => {
        const shouldThrow = () => assertUndefined(null)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_UNDEFINED',
          message: 'Value is not undefined.',
          context: { value: null, received: 'null' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as undefined', () => {
        const value: unknown = undefined
        assertUndefined(value)
        expectTypeOf(value).toEqualTypeOf<undefined>()
      })
    })
  })
}
