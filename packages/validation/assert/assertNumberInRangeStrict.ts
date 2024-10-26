import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is strictly between a minimum and maximum value.
 *
 * @param value The value to assert as a number.
 * @param min The lower bound of the range.
 * @param max The upper bound of the range.
 * @example assertNumberInRangeStrict(5, 1, 10) // void
 */
export function assertNumberInRangeStrict(value: unknown, min: number, max: number): asserts value is number {
  assertNumber(value)
  if (value > min && value < max) return
  throw new ValidationError({
    name: 'E_NUMBER_OUT_OF_RANGE_STRICT',
    message: `Number is not strictly between ${min} and ${max}.`,
    context: { value, min, max },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNumberInRangeStrict', () => {
    describe('pass', () => {
      it('should pass if value is strictly between min and max', () => {
        const result = assertNumberInRangeStrict(5, 1, 10)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is equal to min', () => {
        const shouldThrow = () => assertNumberInRangeStrict(1, 1, 10)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NUMBER_OUT_OF_RANGE_STRICT',
          message: 'Number is not strictly between 1 and 10.',
          context: { value: 1, min: 1, max: 10 },
        })
      })

      it('should throw if value is equal to max', () => {
        const shouldThrow = () => assertNumberInRangeStrict(10, 1, 10)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NUMBER_OUT_OF_RANGE_STRICT',
          message: 'Number is not strictly between 1 and 10.',
          context: { value: 10, min: 1, max: 10 },
        })
      })

      it('should throw if value is less than min', () => {
        const shouldThrow = () => assertNumberInRangeStrict(0, 1, 10)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NUMBER_OUT_OF_RANGE_STRICT',
          message: 'Number is not strictly between 1 and 10.',
          context: { value: 0, min: 1, max: 10 },
        })
      })

      it('should throw if value is greater than max', () => {
        const shouldThrow = () => assertNumberInRangeStrict(11, 1, 10)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NUMBER_OUT_OF_RANGE_STRICT',
          message: 'Number is not strictly between 1 and 10.',
          context: { value: 11, min: 1, max: 10 },
        })
      })

      it('should throw if value is not a number', () => {
        const shouldThrow = () => assertNumberInRangeStrict('5' as unknown, 1, 10)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NUMBER',
          message: 'Value is not a number.',
          context: { value: '5', received: 'string' },
        })
      })

      it('should throw if value is NaN', () => {
        const shouldThrow = () => assertNumberInRangeStrict(Number.NaN, 1, 10)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NUMBER',
          message: 'Value is not a number.',
          context: { value: Number.NaN, received: 'number' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate a number strictly between min and max', () => {
        const value = 5 as unknown
        assertNumberInRangeStrict(value, 1, 10)
        expectTypeOf(value).toEqualTypeOf<number>()
      })
    })
  })
}
