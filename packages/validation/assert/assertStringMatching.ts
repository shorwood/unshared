import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string that matches a regular expression.
 *
 * @param value The value to assert as a string matching a regular expression.
 * @param exp The regular expression to match the value against.
 * @throws `ValidationError` if the value is not a string or does not match the regular expression.
 * @example assertStringMatching('Hello, World!', /Hello, \w+!/) // void
 */
export function assertStringMatching(value: unknown, exp: RegExp): asserts value is string {
  assertString(value)
  if (exp.test(value)) return
  throw new ValidationError({
    name: 'E_STRING_NOT_MATCHING_REGULAR_EXPRESSION',
    message: `String does not match the regular expression: ${exp}.`,
    context: { value, exp },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringMatching', () => {
    describe('pass', () => {
      it('should pass if value matches the regular expression', () => {
        const result = assertStringMatching('Hello, World!', /Hello, \w+!/)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value does not match the regular expression', () => {
        const shouldThrow = () => assertStringMatching('Hello, World!', /Hello, \d+!/)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_MATCHING_REGULAR_EXPRESSION',
          message: String.raw`String does not match the regular expression: /Hello, \d+!/.`,
          context: { value: 'Hello, World!', exp: /Hello, \d+!/ },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringMatching({}, /Hello, \w+!/)
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
        const value: unknown = 'Hello, World!'
        assertStringMatching(value, /Hello, \w+!/)
        expectTypeOf(value).toEqualTypeOf<string>()
      })
    })
  })
}
