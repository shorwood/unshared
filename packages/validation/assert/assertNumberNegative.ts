import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is a number less than or equal to `0`.
 *
 * @param value The value to assert as a number less than or equal to `0`.
 * @throws `ValidationError` if the value is not a number less than or equal to `0`.
 * @example assertNumberNegative(-1) // void
 */
export function assertNumberNegative(value: unknown): asserts value is number {
  assertNumber(value)
  if (value <= 0) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_NEGATIVE',
    message: 'Number is not negative.',
    context: { value },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNumberNegative', () => {
    describe('pass', () => {
      it('should pass if value is a number less than or equal to 0', () => {
        const result = assertNumberNegative(-1)
        expect(result).toBeUndefined()
      })

      it('should pass if value is 0', () => {
        const result = assertNumberNegative(0)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is greater than 0', () => {
        const shouldThrow = () => assertNumberNegative(1)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NUMBER_NOT_NEGATIVE',
          message: 'Number is not negative.',
          context: { value: 1 },
        })
      })

      it('should throw if value is not a number', () => {
        const shouldThrow = () => assertNumberNegative('1')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NUMBER',
          message: 'Value is not a number.',
          context: { value: '1', received: 'string' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a number less than or equal to 0', () => {
        const value: unknown = -1
        assertNumberNegative(value)
        expectTypeOf(value).toEqualTypeOf<number>()
      })
    })
  })
}
