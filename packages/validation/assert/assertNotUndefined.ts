/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/no-null */
import type { NotUndefined } from '@unshared/types'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is not `undefined`.
 *
 * @param value The value to assert as not `undefined`.
 * @throws `ValidationError` if the value is `undefined`.
 * @example assertNotUndefined(1) // void
 */
export function assertNotUndefined<T>(value: T): asserts value is NotUndefined<T> {
  if (value !== undefined) return
  throw new ValidationError({
    name: 'E_IS_UNDEFINED',
    message: 'Value is undefined.',
    context: { value },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNotUndefined', () => {
    describe('pass', () => {
      it('should pass if value is not undefined', () => {
        const result = assertNotUndefined(1)
        expect(result).toBeUndefined()
      })

      it('should pass if value is null', () => {
        const result = assertNotUndefined(null)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is undefined', () => {
        const shouldThrow = () => assertNotUndefined(undefined)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_IS_UNDEFINED',
          message: 'Value is undefined.',
          context: { value: undefined },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as not undefined', () => {
        const value: number | undefined = 1
        assertNotUndefined(value)
        expectTypeOf(value).toEqualTypeOf<number>()
      })
    })
  })
}
