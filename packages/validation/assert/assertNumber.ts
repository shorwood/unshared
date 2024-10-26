import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is a number.
 *
 * @param value The value to assert as a number.
 * @throws `ValidationError` if the value is not a number.
 * @example assertNumber(1) // void
 */
export function assertNumber(value: unknown): asserts value is number {
  if (typeof value === 'number' && !Number.isNaN(value)) return
  throw new ValidationError({
    name: 'E_NOT_NUMBER',
    message: 'Value is not a number.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNumber', () => {
    describe('pass', () => {
      it('should pass if value is a number', () => {
        const result = assertNumber(1)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not a number', () => {
        const shouldThrow = () => assertNumber('1')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NUMBER',
          message: 'Value is not a number.',
          context: { value: '1', received: 'string' },
        })
      })

      it('should throw if value is NaN', () => {
        const shouldThrow = () => assertNumber(Number.NaN)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NUMBER',
          message: 'Value is not a number.',
          context: { value: Number.NaN, received: 'number' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a number', () => {
        const value: unknown = 1
        assertNumber(value)
        expectTypeOf(value).toEqualTypeOf<number>()
      })
    })
  })
}
