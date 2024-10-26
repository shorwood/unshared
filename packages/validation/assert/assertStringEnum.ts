import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string is one of the values in an array.
 *
 * @param value The value to assert as a string matching a regular expression.
 * @param values The values to match the value against.
 * @throws `ValidationError` if the value is not a string or does not match the regular expression.
 * @example assertStringEnum('Hello, World!', ['Hello, World!', 'Hello, Universe!']) // void
 */
export function assertStringEnum<T extends string>(value: unknown, values: T[]): asserts value is T {
  assertString(value)
  if (values.includes(value as T)) return
  const messageValues = values.map(x => `'${x}'`).join(', ')
  throw new ValidationError({
    name: 'E_STRING_NOT_ONE_OF_VALUES',
    message: `String is not one of the values: ${messageValues}.`,
    context: { value, values },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringEnum', () => {
    describe('pass', () => {
      it('should pass if value is one of the values', () => {
        const result = assertStringEnum('Hello, World!', ['Hello, World!', 'Hello, Universe!'])
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not one of the values', () => {
        const shouldThrow = () => assertStringEnum('Hello, World!', ['Hello, Universe!'])
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_STRING_NOT_ONE_OF_VALUES',
          message: 'String is not one of the values: \'Hello, Universe!\'.',
          context: { value: 'Hello, World!', values: ['Hello, Universe!'] },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringEnum({}, ['Hello, World!'])
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
        assertStringEnum(value, ['Hello, World!', 'Hello, Universe!'])
        expectTypeOf(value).toEqualTypeOf<'Hello, Universe!' | 'Hello, World!'>()
      })
    })
  })
}
