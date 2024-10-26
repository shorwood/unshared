import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that starts the given string.
 *
 * @param value The value to assert as a string starting with the given string.
 * @param start The string to match the start of the value against.
 * @throws `ValidationError` if the value is not a string or does not start with the given string.
 */
export function assertStringStartingWith<T extends string>(value: unknown, start: T): asserts value is `${T}${string}` {
  assertString(value)
  if (value.startsWith(start)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_STARTING_WITH',
    message: `String does not start with "${start}".`,
    context: { value, start },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringStartingWith', () => {
    describe('pass', () => {
      it('should pass if value is a string starting with the given string', () => {
        const result = assertStringStartingWith('Hello, World!', 'Hello')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringStartingWith(1, 'Hello')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_STRING',
          message: 'Value is not a string.',
          context: { value: 1, received: 'number' },
        })
      })

      it('should throw if value does not start with the given string', () => {
        const shouldThrow = () => assertStringStartingWith('Hello, World!', 'World')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_STARTING_WITH',
          message: 'String does not start with "World".',
          context: { value: 'Hello, World!', start: 'World' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a string starting with the given string', () => {
        const value: unknown = 'Hello, World!'
        assertStringStartingWith(value, 'Hello')
        expectTypeOf(value).toEqualTypeOf<`Hello${string}`>()
      })
    })
  })
}
