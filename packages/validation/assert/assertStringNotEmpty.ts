import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string and that it is not empty. An empty string
 * is a string that has a length of zero or only contains whitespace characters.
 *
 * @param value The value to assert as a non-empty string.
 * @throws `ValidationError` if the value is not a non-empty string.
 * @example assertStringNotEmpty('Hello, World!') // void
 */
export function assertStringNotEmpty(value: unknown): asserts value is string {
  assertString(value)
  if (value.trim().length > 0) return
  throw new ValidationError({
    name: 'E_STRING_EMPTY',
    message: 'String is empty.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringNotEmpty', () => {
    describe('pass', () => {
      it('should pass if value is a non-empty string', () => {
        const result = assertStringNotEmpty('Hello, World!')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is an empty string', () => {
        const shouldThrow = () => assertStringNotEmpty('')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_EMPTY',
          message: 'String is empty.',
          context: { value: '' },
        })
      })

      it('should throw if value is a string with only whitespace characters', () => {
        const shouldThrow = () => assertStringNotEmpty(' ')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_EMPTY',
          message: 'String is empty.',
          context: { value: ' ' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringNotEmpty({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_STRING',
          message: 'Value is not a string.',
          context: { value: {}, received: 'object' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a non-empty string', () => {
        const value: unknown = 'Hello, World!'
        assertStringNotEmpty(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
