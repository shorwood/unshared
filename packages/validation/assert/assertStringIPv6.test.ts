/* eslint-disable sonarjs/no-hardcoded-ip */
import { attempt } from '@unshared/functions'
import { assertStringIPv6 } from './assertStringIPv6'

describe('assertStringIPv6', () => {
  describe('pass', () => {
    it('should pass if value is a valid IPv6 address', () => {
      const result = assertStringIPv6('2001:db8::1')
      expect(result).toBeUndefined()
    })

    it.each([
      ['localhost', '::1'],
      ['unspecified', '::'],
      ['full format', '2001:db8:85a3::8a2e:370:7334'],
      ['link-local address', 'fe80::1%lo0'],
      ['compressed format', '2001:db8::8a2e:370:7334'],
      ['multicast address', 'ff02::1'],
      ['full format with leading zeros', '2001:db8:85a3:0:0:8a2e:370:7334'],
    ])('should pass for %s IPv6 address: %s', (message, ip) => {
      const result = assertStringIPv6(ip)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a valid IPv6 address', () => {
      const shouldThrow = () => assertStringIPv6('invalid::address::')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_IPV6',
        message: 'String is not a valid IPv6 address.',
        context: { value: 'invalid::address::' },
      })
    })

    it('should throw for IPv4 addresses', () => {
      const shouldThrow = () => assertStringIPv6('192.168.1.1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_IPV6',
        message: 'String is not a valid IPv6 address.',
        context: { value: '192.168.1.1' },
      })
    })

    it.each([
      ['double colon in multiple places', '2001:db8::85a3::7334'],
      ['invalid hexadecimal characters', 'gggg::1'],
      ['too many segments', '2001:db8:85a3:0:0:8a2e:370:7334:extra'],
      ['not an IPv6 format', 'not.an.ipv6.address'],
      ['invalid character in segment', '2001:db8:85a3:0:0:8a2e:370g:7334'],
    ])('should throw for %s: %s', (description, ip) => {
      const shouldThrow = () => assertStringIPv6(ip)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_IPV6',
        message: 'String is not a valid IPv6 address.',
        context: { value: ip },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringIPv6({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is an empty string', () => {
      const shouldThrow = () => assertStringIPv6('')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_EMPTY',
        message: 'String is empty.',
        context: { value: '' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a string', () => {
      const value: unknown = '2001:db8::1'
      assertStringIPv6(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
