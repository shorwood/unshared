import { ValidationError } from '../createValidationError'
import { assertNumber } from './assertNumber'

/**
 * Assert that a value is an integer number.
 *
 * @param value The value to assert as an integer number.
 * @throws `ValidationError` if the value is not an integer number.
 * @example assertNumberInteger(1) // void
 */
export function assertNumberInteger(value: unknown): asserts value is number {
  assertNumber(value)
  if (Number.isSafeInteger(value)) return
  throw new ValidationError({
    name: 'E_NUMBER_NOT_INTEGER',
    message: 'Number is not an integer.',
    context: { value },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertNumberInteger', () => {
    describe('pass', () => {
      it('should pass if value is an integer number', () => {
        const result = assertNumberInteger(1)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not an integer number', () => {
        const shouldThrow = () => assertNumberInteger(1.5)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NUMBER_NOT_INTEGER',
          message: 'Number is not an integer.',
          context: { value: 1.5 },
        })
      })

      it('should throw if value is not a number', () => {
        const shouldThrow = () => assertNumberInteger('1')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_NUMBER',
          message: 'Value is not a number.',
          context: { value: '1', received: 'string' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as an integer number', () => {
        const value: unknown = 1
        assertNumberInteger(value)
        expectTypeOf(value).toEqualTypeOf<number>()
      })
    })
  })
}
