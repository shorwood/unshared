import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'
import { assertNumberInteger } from './assertNumberInteger'

/**
 * Obligatory meme function to assert if a value is an odd number.
 *
 * @param value The value to assert as an odd number.
 * @throws `ValidationError` if the value is not an odd number.
 * @example assertNumberOdd(1) // true
 */
export function assertNumberOdd(value: unknown): asserts value is number {
  assertNumber(value)
  assertNumberInteger(value)
  if ((value & 0x1) !== 0) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_ODD',
    message: 'Number is not odd.',
    context: { value },
  })

}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNumberOdd', () => {
    describe('pass', () => {
      it('should pass if value is an odd number', () => {
        const result = assertNumberOdd(1)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is an even number', () => {
        const shouldThrow = () => assertNumberOdd(2)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NUMBER_NOT_ODD',
          message: 'Number is not odd.',
          context: { value: 2 },
        })
      })

      it('should throw if value is not an integer', () => {
        const shouldThrow = () => assertNumberOdd(1.5)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NUMBER_NOT_INTEGER',
          message: 'Number is not an integer.',
          context: { value: 1.5 },
        })
      })

      it('should throw if value is not a number', () => {
        const shouldThrow = () => assertNumberOdd('1')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NUMBER',
          message: 'Value is not a number.',
          context: { value: '1', received: 'string' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as an odd number', () => {
        const value: unknown = 1
        assertNumberOdd(value)
        expectTypeOf(value).toEqualTypeOf<number>()
      })
    })
  })
}
