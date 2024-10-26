import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is a boolean.
 *
 * @param value The value to assert as a boolean.
 * @throws `ValidationError` if the value is not a boolean.
 * @example assertBoolean(true) // void
 */
export function assertBoolean(value: unknown): asserts value is boolean {
  if (typeof value === 'boolean') return
  throw new ValidationError({
    name: 'E_NOT_BOOLEAN',
    message: 'Value is not a boolean.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertBoolean', () => {
    describe('pass', () => {
      it('should pass if value is a boolean', () => {
        const result = assertBoolean(true)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not a boolean', () => {
        const shouldThrow = () => assertBoolean({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_BOOLEAN',
          message: 'Value is not a boolean.',
          context: { value: {}, received: 'object' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a boolean', () => {
        const value: unknown = true
        assertBoolean(value)
        expectTypeOf(value).toEqualTypeOf<boolean>()
      })
    })
  })
}
