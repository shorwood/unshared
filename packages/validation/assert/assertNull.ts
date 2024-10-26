/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is `null`.
 *
 * @param value The value to assert as `null`.
 * @throws `ValidationError` if the value is not `null`.
 * @example assertNull(null) // void
 */
export function assertNull(value: unknown): asserts value is null {
  if (value === null) return
  throw new ValidationError({
    name: 'E_NOT_NULL',
    message: 'Value is not null.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNull', () => {
    describe('pass', () => {
      it('should pass if value is null', () => {
        const result = assertNull(null)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not null', () => {
        const shouldThrow = () => assertNull({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NULL',
          message: 'Value is not null.',
          context: { value: {}, received: 'object' },
        })
      })

      it('should throw if value is undefined', () => {
        const shouldThrow = () => assertNull(undefined)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NULL',
          message: 'Value is not null.',
          context: { value: undefined, received: 'undefined' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as null', () => {
        const value: unknown = null
        assertNull(value)
        expectTypeOf(value).toEqualTypeOf<null>()
      })
    })
  })
}
