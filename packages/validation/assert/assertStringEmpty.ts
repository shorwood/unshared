import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string and that it is empty. An empty string is a
 * string that has a length of zero or only contains whitespace characters.
 *
 * @param value The value to assert as an empty string.
 * @throws `ValidationError` if the value is not an empty string.
 * @example assertStringEmpty('') // void
 */
export function assertStringEmpty(value: unknown): asserts value is string {
  assertString(value)
  if (value.trim().length === 0) return
  throw new ValidationError({
    name: 'E_STRING_NOT_EMPTY',
    message: 'String is not empty.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringEmpty', () => {
    describe('pass', () => {
      it('should pass if value is an empty string', () => {
        const result = assertStringEmpty('')
        expect(result).toBeUndefined()
      })

      it('should pass if value is a string of whitespace characters', () => {
        const result = assertStringEmpty(' \n\t')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not an empty string', () => {
        const shouldThrow = () => assertStringEmpty('Hello, World!')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_EMPTY',
          message: 'String is not empty.',
          context: { value: 'Hello, World!' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringEmpty({})
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
        const value: unknown = ''
        assertStringEmpty(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
