import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

export const EXPS_MAC_ADDRESS = [
  // MAC address patterns: supports colon, hyphen, and dot separators
  /^(?:[\dA-Fa-f]{2}:){5}[\dA-Fa-f]{2}$/, // 00:1B:44:11:3A:B7
  /^(?:[\dA-Fa-f]{2}-){5}[\dA-Fa-f]{2}$/, // 00-1B-44-11-3A-B7
  /^(?:[\dA-Fa-f]{4}\.){2}[\dA-Fa-f]{4}$/, // 001B.4411.3AB7
  /^[\dA-Fa-f]{12}$/, // 001B44113AB7
]

/**
 * Assert that a value is a string and that it is a valid MAC address.
 *
 * @param value The value to assert as a valid MAC address.
 * @throws `AssertionError` if the value is not a valid MAC address.
 * @example assertStringMacAddress('00:1B:44:11:3A:B7') // void
 */
export function assertStringMacAddress(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (EXPS_MAC_ADDRESS.some(pattern => pattern.test(value))) return
  throw createAssertionError({
    name: 'E_STRING_NOT_MAC_ADDRESS',
    message: 'String is not a valid MAC address.',
    context: { value },
    schema: { type: 'string', pattern: '^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$' },
  })
}
