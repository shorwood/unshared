import { toTitleCase } from '@unshared/string/toTitleCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in title case.
 *
 * @param value The value to assert as in title case.
 * @throws `ValidationError` if the value is not in title case.
 * @example assertStringTitleCase('Hello World') // void
 */
export function assertStringTitleCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toTitleCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_TITLE_CASE',
    message: 'String is not in title case.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringTitleCase', () => {
    describe('pass', () => {
      it('should pass if value is in title case', () => {
        const result = assertStringTitleCase('Hello World')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not in title case', () => {
        const shouldThrow = () => assertStringTitleCase('Hello, World!')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_TITLE_CASE',
          message: 'String is not in title case.',
          context: { value: 'Hello, World!' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringTitleCase({})
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
        const value: unknown = 'Hello World'
        assertStringTitleCase(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
