import { toSnakeCase } from '@unshared/string/toSnakeCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in snake case.
 *
 * @param value The value to assert as in snake case.
 * @throws `ValidationError` if the value is not in snake case.
 * @example assertStringSnakeCase('hello_world') // void
 */
export function assertStringSnakeCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toSnakeCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_SNAKE_CASE',
    message: 'String is not in snake case.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringSnakeCase', () => {
    describe('pass', () => {
      it('should pass if value is in snake case', () => {
        const result = assertStringSnakeCase('hello_world')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not in snake case', () => {
        const shouldThrow = () => assertStringSnakeCase('Hello, World!')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_SNAKE_CASE',
          message: 'String is not in snake case.',
          context: { value: 'Hello, World!' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringSnakeCase({})
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
        const value: unknown = 'hello_world'
        assertStringSnakeCase(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
