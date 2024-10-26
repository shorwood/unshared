import { toConstantCase } from '@unshared/string/toConstantCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in constant case.
 *
 * @param value The value to assert as in constant case.
 * @throws `ValidationError` if the value is not in constant case.
 * @example assertStringConstantCase('HELLO_WORLD') // void
 */
export function assertStringConstantCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toConstantCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_CONSTANT_CASE',
    message: 'String is not in constant case.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringConstantCase', () => {
    describe('pass', () => {
      it('should pass if value is in constant case', () => {
        const result = assertStringConstantCase('HELLO_WORLD')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not in constant case', () => {
        const shouldThrow = () => assertStringConstantCase('Hello, World!')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_CONSTANT_CASE',
          message: 'String is not in constant case.',
          context: { value: 'Hello, World!' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringConstantCase({})
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
        const value: unknown = 'HELLO_WORLD'
        assertStringConstantCase(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
