import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is strictly a number greater than `0`.
 *
 * @param value The value to assert as a number greater than `0`.
 * @throws `ValidationError` if the value is not a number greater than `0`.
 * @example assertNumberPositiveStrict(1) // void
 */
export function assertNumberPositiveStrict(value: unknown): asserts value is number {
  assertNumber(value)
  if (value > 0) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_POSITIVE_STRICT',
    message: 'Number is not strictly positive.',
    context: { value },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNumberPositiveStrict', () => {
    describe('pass', () => {
      it('should pass if value is a number greater than 0', () => {
        const result = assertNumberPositiveStrict(1)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is less than or equal to 0', () => {
        const shouldThrow = () => assertNumberPositiveStrict(0)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NUMBER_NOT_POSITIVE_STRICT',
          message: 'Number is not strictly positive.',
          context: { value: 0 },
        })
      })

      it('should throw if value is not a number', () => {
        const shouldThrow = () => assertNumberPositiveStrict('1')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NUMBER',
          message: 'Value is not a number.',
          context: { value: '1', received: 'string' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a number greater than 0', () => {
        const value: unknown = 1
        assertNumberPositiveStrict(value)
        expectTypeOf(value).toEqualTypeOf<number>()
      })
    })
  })
}
