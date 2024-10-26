import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is a string.
 *
 * @param value The value to assert as a string.
 * @throws `ValidationError` if the value is not a string.
 * @example assertString('Hello, World!') // void
 */
export function assertString(value: unknown): asserts value is string {
  if (typeof value === 'string') return
  throw new ValidationError({
    name: 'E_NOT_STRING',
    message: 'Value is not a string.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertString', () => {
    describe('pass', () => {
      it('should pass if value is a string', () => {
        const result = assertString('Hello, World!')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertString({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_STRING',
          message: 'Value is not a string.',
          context: { value: {}, received: 'object' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a string', () => {
        const value: unknown = 'Hello, World!'
        assertString(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
