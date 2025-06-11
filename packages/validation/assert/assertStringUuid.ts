/* eslint-disable sonarjs/regex-complexity */
import type { UUID } from 'node:crypto'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/** Regular expression for a UUID. */
export const EXP_UUID = /^(?:[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}|0{8}-(?:0{4}-){3}0{12})$/i

/**
 * Assert that a value is a UUID as specified by [RFC 4122](https://www.ietf.org/rfc/rfc4122.txt).
 *
 * @param value The value to assert as a UUID.
 * @throws `AssertionError` if the value is not a UUID.
 * @example assertStringUuid('00000000-0000-0000-0000-000000000000') // void
 */
export function assertStringUuid(value: unknown): asserts value is UUID {
  assertString(value)
  if (EXP_UUID.test(value)) return
  throw createAssertionError({
    name: 'E_STRING_NOT_UUID',
    message: 'String is not a UUID.',
    context: { value },
    schema: { type: 'string', format: 'uuid' },
  })
}
