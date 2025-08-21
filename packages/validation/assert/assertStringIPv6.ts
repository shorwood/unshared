import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

export const EXPS_IPV6 = [
  // Full format: 2001:db8:85a3:0:0:8a2e:370:7334
  /^(?:[\dA-Fa-f]{1,4}:){7}[\dA-Fa-f]{1,4}$/,
  // Compressed with :: at the end: 2001:db8::
  /^([\dA-Fa-f]{1,4}:)+::$/,
  // Compressed with :: at the start: ::1
  /^::([\dA-Fa-f]{1,4}:)*[\dA-Fa-f]{1,4}$/,
  // Compressed with :: in the middle: 2001:db8::1
  /^([\dA-Fa-f]{1,4}:)*[\dA-Fa-f]{1,4}::([\dA-Fa-f]{1,4}:)*[\dA-Fa-f]{1,4}$/,
  // Loopback
  /^::1$/,
  // Unspecified
  /^::$/,
]

/**
 * Assert that a value is a string and that it is a valid IPv6 address.
 *
 * @param value The value to assert as a valid IPv6 address.
 * @throws `AssertionError` if the value is not a valid IPv6 address.
 * @example assertStringIPv6('2001:db8::1') // void
 */
export function assertStringIPv6(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  let cleanValue = value
  if (value.includes('%')) cleanValue = value.split('%')[0]
  if (EXPS_IPV6.some(pattern => pattern.test(cleanValue))) return
  throw createAssertionError({
    name: 'E_STRING_NOT_IPV6',
    message: 'String is not a valid IPv6 address.',
    context: { value },
    schema: { type: 'string', format: 'ipv6' },
  })
}
