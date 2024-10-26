import { toPathCase } from '@unshared/string'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in path case.
 *
 * @param value The value to assert as in path case.
 * @throws `ValidationError` if the value is not in path case.
 * @example assertStringPathCase('hello/world') // void
 */
export function assertStringPathCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toPathCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_PATH_CASE',
    message: 'String is not in path case.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringPathCase', () => {
    describe('pass', () => {
      it('should pass if value is in path case', () => {
        const result = assertStringPathCase('hello/world')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not in path case', () => {
        const shouldThrow = () => assertStringPathCase('Hello, World!')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_PATH_CASE',
          message: 'String is not in path case.',
          context: { value: 'Hello, World!' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringPathCase({})
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
        const value: unknown = 'hello/world'
        assertStringPathCase(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
