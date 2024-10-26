import { toKebabCase } from '@unshared/string/toKebabCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in kebab case.
 *
 * @param value The value to assert as in kebab case.
 * @throws `ValidationError` if the value is not in kebab case.
 * @example assertStringKebabCase('hello-world') // void
 */
export function assertStringKebabCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toKebabCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_KEBAB_CASE',
    message: 'String is not in kebab case.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringKebabCase', () => {
    describe('pass', () => {
      it('should pass if value is in kebab case', () => {
        const result = assertStringKebabCase('hello-world')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not in kebab case', () => {
        const shouldThrow = () => assertStringKebabCase('Hello, World!')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_KEBAB_CASE',
          message: 'String is not in kebab case.',
          context: { value: 'Hello, World!' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringKebabCase({})
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
        const value: unknown = 'hello-world'
        assertStringKebabCase(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
