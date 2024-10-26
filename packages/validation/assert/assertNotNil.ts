/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import type { NotNil } from '@unshared/types'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is not `null` or `undefined`.
 *
 * @param value The value to assert as not `null` or `undefined`.
 * @throws `ValidationError` if the value is `null` or `undefined`.
 * @example assertNotNil(1) // void
 */
export function assertNotNil<T>(value: T): asserts value is NotNil<T> {
  if (value !== null && value !== undefined) return
  throw new ValidationError({
    name: 'E_IS_NIL',
    message: 'Value is null or undefined.',
    context: { value },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNotNil', () => {
    describe('pass', () => {
      it('should pass if value is not null or undefined', () => {
        const result = assertNotNil(1)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is null', () => {
        const shouldThrow = () => assertNotNil(null)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_IS_NIL',
          message: 'Value is null or undefined.',
          context: { value: null },
        })
      })

      it('should throw if value is undefined', () => {
        const shouldThrow = () => assertNotNil(undefined)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_IS_NIL',
          message: 'Value is null or undefined.',
          context: { value: undefined },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as not null or undefined', () => {
        const value: null | number | undefined = 1
        assertNotNil(value)
        expectTypeOf(value).toEqualTypeOf<number>()
      })
    })
  })
}
