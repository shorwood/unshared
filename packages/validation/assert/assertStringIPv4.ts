import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

// eslint-disable-next-line sonarjs/regex-complexity
export const EXP_IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})$/

/**
 * Assert that a value is a string and that it is a valid IPv4 address.
 *
 * @param value The value to assert as a valid IPv4 address.
 * @throws `AssertionError` if the value is not a valid IPv4 address.
 * @example assertStringIPv4('192.168.1.1') // void
 */
export function assertStringIPv4(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)
  if (!EXP_IPV4.test(value)) {
    throw createAssertionError({
      name: 'E_STRING_NOT_IPV4',
      message: 'String is not a valid IPv4 address.',
      context: { value },
      schema: { type: 'string', format: 'ipv4' },
    })
  }
  const parts = value.split('.')
  for (const part of parts) {
    const octet = Number(part)
    if (octet > 255 || (part.length > 1 && part.startsWith('0'))) {
      throw createAssertionError({
        name: 'E_STRING_NOT_IPV4',
        message: 'String is not a valid IPv4 address.',
        context: { value },
        schema: { type: 'string', format: 'ipv4' },
      })
    }
  }
}
