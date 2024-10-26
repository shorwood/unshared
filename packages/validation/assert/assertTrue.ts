import { ValidationError } from '../createValidationError'
import { assertBoolean } from './assertBoolean'

/**
 * Assert that a value is a boolean equal to `true`.
 *
 * @param value The value to assert as a boolean equal to `true`.
 * @throws `ValidationError` if the value is not a boolean equal to `true`.
 * @example assertTrue(true) // void
 */
export function assertTrue(value: unknown): asserts value is true {
  assertBoolean(value)
  if (value === true) return
  throw new ValidationError({
    name: 'E_BOOLEAN_NOT_TRUE',
    message: 'Boolean is not true.',
    context: { value },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertTrue', () => {
    describe('pass', () => {
      it('should pass if value is a boolean equal to true', () => {
        const result = assertTrue(true)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is a boolean equal to false', () => {
        const shouldThrow = () => assertTrue(false)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_BOOLEAN_NOT_TRUE',
          message: 'Boolean is not true.',
          context: { value: false },
        })
      })

      it('should throw if value is not a boolean', () => {
        const shouldThrow = () => assertTrue({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_BOOLEAN',
          message: 'Value is not a boolean.',
          context: { value: {}, received: 'object' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a boolean equal to true', () => {
        const value: unknown = true
        assertTrue(value)
        expectTypeOf(value).toEqualTypeOf<true>()
      })
    })
  })
}
