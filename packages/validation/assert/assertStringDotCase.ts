import { toDotCase } from '@unshared/string/toDotCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in dot case.
 *
 * @param value The value to assert as in dot case.
 * @throws `ValidationError` if the value is not in dot case.
 * @example assertStringDotCase('hello.world') // void
 */
export function assertStringDotCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toDotCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_DOT_CASE',
    message: 'String is not in dot case.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringDotCase', () => {
    describe('pass', () => {
      it('should pass if value is in dot case', () => {
        const result = assertStringDotCase('hello.world')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not in dot case', () => {
        const shouldThrow = () => assertStringDotCase('Hello, World!')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_DOT_CASE',
          message: 'String is not in dot case.',
          context: { value: 'Hello, World!' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringDotCase({})
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
        const value: unknown = 'hello.world'
        assertStringDotCase(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
