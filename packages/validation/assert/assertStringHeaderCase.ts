import { toHeaderCase } from '@unshared/string/toHeaderCase'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is in header case.
 *
 * @param value The value to assert as in header case.
 * @throws `ValidationError` if the value is not in header case.
 * @example assertStringHeaderCase('Hello-World') // void
 */
export function assertStringHeaderCase(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (value === toHeaderCase(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_HEADER_CASE',
    message: 'String is not in header case.',
    context: { value },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringHeaderCase', () => {
    describe('pass', () => {
      it('should pass if value is in header case', () => {
        const result = assertStringHeaderCase('Hello-World')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not in header case', () => {
        const shouldThrow = () => assertStringHeaderCase('Hello, World!')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_HEADER_CASE',
          message: 'String is not in header case.',
          context: { value: 'Hello, World!' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringHeaderCase({})
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
        const value: unknown = 'Hello-World'
        assertStringHeaderCase(value)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
