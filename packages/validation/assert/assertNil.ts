/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is `null` or `undefined`.
 *
 * @param value The value to assert as `null` or `undefined`.
 * @throws `ValidationError` if the value is neither `null` nor `undefined`.
 * @example assertNil(null) // void
 */
export function assertNil(value: unknown): asserts value is null | undefined {
  if (value === null || value === undefined) return
  throw new ValidationError({
    name: 'E_NOT_NIL',
    message: 'Value is neither null nor undefined.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNil', () => {
    describe('pass', () => {
      it('should pass if value is null', () => {
        const result = assertNil(null)
        expect(result).toBeUndefined()
      })

      it('should pass if value is undefined', () => {
        const result = assertNil(undefined)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not null or undefined', () => {
        const shouldThrow = () => assertNil({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NIL',
          message: 'Value is neither null nor undefined.',
          context: { value: {}, received: 'object' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as null or undefined', () => {
        const value: unknown = null
        assertNil(value)
        expectTypeOf(value).toEqualTypeOf<null | undefined>()
      })
    })
  })
}
