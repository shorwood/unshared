import { toPascalCase } from '@unshared/string/toPascalCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in pascal case.
 *
 * @param value The value to assert as in pascal case.
 * @throws `ValidationError` if the value is not in pascal case.
 * @example assertStringPascalCase('HelloWorld') // void
 */
export function assertStringPascalCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toPascalCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_PASCAL_CASE',
    message: 'String is not in pascal case.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringPascalCase', () => {
    describe('pass', () => {
      it('should pass if value is in pascal case', () => {
        const result = assertStringPascalCase('HelloWorld')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not in pascal case', () => {
        const shouldThrow = () => assertStringPascalCase('Hello, World!')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_PASCAL_CASE',
          message: 'String is not in pascal case.',
          context: { value: 'Hello, World!' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringPascalCase({})
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
        const value: unknown = 'HelloWorld'
        assertStringPascalCase(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
