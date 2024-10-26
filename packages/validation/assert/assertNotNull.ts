/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/no-null */
import type { NotNull } from '@unshared/types'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is not `null`.
 *
 * @param value The value to assert as not `null`.
 * @throws `ValidationError` if the value is `null`.
 * @example assertNotNull(1) // void
 */
export function assertNotNull<T>(value: T): asserts value is NotNull<T> {
  if (value !== null) return
  throw new ValidationError({
    name: 'E_IS_NULL',
    message: 'Value is null.',
    context: { value },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNotNull', () => {
    describe('pass', () => {
      it('should pass if value is not null', () => {
        const result = assertNotNull(1)
        expect(result).toBeUndefined()
      })

      it('should pass if value is undefined', () => {
        const result = assertNotNull(undefined)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is null', () => {
        const shouldThrow = () => assertNotNull(null)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_IS_NULL',
          message: 'Value is null.',
          context: { value: null },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as not null', () => {
        const value: null | number = 1
        assertNotNull(value)
        expectTypeOf(value).toEqualTypeOf<number>()
      })
    })
  })
}
