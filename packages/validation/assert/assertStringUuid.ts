import type { UUID } from 'node:crypto'
import { ValidationError } from '../createValidationError'
import { assertString } from './assertString'

/** Regular expression for a UUID. */
export const EXP_UUID = /^(?:[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}|0{8}-(?:0{4}-){3}0{12})$/i

/**
 * Assert that a value is a UUID as specified by [RFC 4122](https://www.ietf.org/rfc/rfc4122.txt).
 *
 * @param value The value to assert as a UUID.
 * @throws `ValidationError` if the value is not a UUID.
 * @example assertStringUuid('00000000-0000-0000-0000-000000000000') // void
 */
export function assertStringUuid(value: unknown): asserts value is UUID {
  assertString(value)
  if (EXP_UUID.test(value)) return
  throw new ValidationError({
    name: 'E_NOT_UUID',
    message: 'String is not a UUID.',
    context: { value },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertStringUuid', () => {
    describe('pass', () => {
      it('should pass if value is a UUID', () => {
        const result = assertStringUuid('00000000-0000-0000-0000-000000000000')
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not a UUID', () => {
        const shouldThrow = () => assertStringUuid('not-a-uuid')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_UUID',
          message: 'String is not a UUID.',
          context: { value: 'not-a-uuid' },
        })
      })

      it('should throw if value is not a string', () => {
        const shouldThrow = () => assertStringUuid(1)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_STRING',
          message: 'Value is not a string.',
          context: { value: 1, received: 'number' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a UUID', () => {
        const value: unknown = '00000000-0000-0000-0000-000000000000'
        assertStringUuid(value)
        expectTypeOf(value).toEqualTypeOf<UUID>()
      })
    })
  })
}
