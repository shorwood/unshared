import { UUID } from 'node:crypto'
import { assertString } from './assertString'
import { ValidationError } from '../ValidationError'

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
    message: `Expected value to be a UUID but received: ${value}`,
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a UUID', () => {
    const result = assertStringUuid('00000000-0000-0000-0000-000000000000')
    expect(result).toBeUndefined()
  })

  test('should throw if value is not a UUID', () => {
    const shouldThrow = () => assertStringUuid('not-a-uuid')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a UUID but received: not-a-uuid')
  })

  test('should throw if value is not a string', () => {
    const shouldThrow = () => assertStringUuid(1)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: number')
  })

  test('should throw if value is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const shouldThrow = () => assertStringUuid(undefined)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
  })

  test('should throw if value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => assertStringUuid(null)
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a string but received: null')
  })

  test('should predicate a UUID', () => {
    const value = '00000000-0000-0000-0000-000000000000' as unknown
    assertStringUuid(value)
    expectTypeOf(value).toEqualTypeOf<UUID>()
  })
}
