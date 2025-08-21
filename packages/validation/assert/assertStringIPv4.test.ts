/* eslint-disable sonarjs/no-hardcoded-ip */
import { attempt } from '@unshared/functions'
import { assertStringIPv4 } from './assertStringIPv4'

describe('assertStringIPv4', () => {
  describe('pass', () => {
    it('should pass if value is a valid IPv4 address', () => {
      const result = assertStringIPv4('192.168.1.1')
      expect(result).toBeUndefined()
    })

    it('should pass for localhost', () => {
      const result = assertStringIPv4('127.0.0.1')
      expect(result).toBeUndefined()
    })

    it('should pass for edge values', () => {
      const result1 = assertStringIPv4('0.0.0.0')
      const result2 = assertStringIPv4('255.255.255.255')
      expect(result1).toBeUndefined()
      expect(result2).toBeUndefined()
    })

    it('should pass for various valid IPv4 addresses', () => {
      const validIPs = [
        '10.0.0.1',
        '172.16.0.1',
        '192.168.0.1',
        '8.8.8.8',
        '1.1.1.1',
      ]

      for (const ip of validIPs) {
        const result = assertStringIPv4(ip)
        expect(result).toBeUndefined()
      }
    })
  })

  describe('fail', () => {
    it('should throw if value is not a valid IPv4 address', () => {
      const shouldThrow = () => assertStringIPv4('256.1.1.1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_IPV4',
        message: 'String is not a valid IPv4 address.',
        context: { value: '256.1.1.1' },
      })
    })

    it('should throw for IPv6 addresses', () => {
      const shouldThrow = () => assertStringIPv4('2001:db8::1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_IPV4',
        message: 'String is not a valid IPv4 address.',
        context: { value: '2001:db8::1' },
      })
    })

    it.each([
      ['192.168.1'],
      ['192.168.1.1.1'],
      ['192.168.01.1'],
      ['192.168.-1.1'],
      ['192.168.256.1'],
      ['not.an.ip.address'],
      ['192.168.1.a'],
    ])('should throw for invalid format: %s', (ip) => {
      const shouldThrow = () => assertStringIPv4(ip)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_IPV4',
        message: 'String is not a valid IPv4 address.',
        context: { value: ip },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringIPv4({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is an empty string', () => {
      const shouldThrow = () => assertStringIPv4('')
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
      const value: unknown = '192.168.1.1'
      assertStringIPv4(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
