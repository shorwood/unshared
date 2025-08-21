/* eslint-disable sonarjs/no-hardcoded-ip */
import { attempt } from '@unshared/functions'
import { assertStringMacAddress } from './assertStringMacAddress'

describe('assertStringMacAddress', () => {
  describe('pass', () => {
    it('should pass for colon-separated MAC address', () => {
      const result = assertStringMacAddress('00:1B:44:11:3A:B7')
      expect(result).toBeUndefined()
    })

    it('should pass for hyphen-separated MAC address', () => {
      const result = assertStringMacAddress('00-1B-44-11-3A-B7')
      expect(result).toBeUndefined()
    })

    it('should pass for dot-separated MAC address', () => {
      const result = assertStringMacAddress('001B.4411.3AB7')
      expect(result).toBeUndefined()
    })

    it('should pass for MAC address without separators', () => {
      const result = assertStringMacAddress('001B44113AB7')
      expect(result).toBeUndefined()
    })

    it('should pass for lowercase MAC addresses', () => {
      const result = assertStringMacAddress('aa:bb:cc:dd:ee:ff')
      expect(result).toBeUndefined()
    })

    it('should pass for uppercase MAC addresses', () => {
      const result = assertStringMacAddress('AA:BB:CC:DD:EE:FF')
      expect(result).toBeUndefined()
    })

    it('should pass for mixed case MAC addresses', () => {
      const result = assertStringMacAddress('aA:bB:cC:dD:eE:fF')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a valid MAC address', () => {
      const shouldThrow = () => assertStringMacAddress('not-a-mac-address')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_MAC_ADDRESS',
        message: 'String is not a valid MAC address.',
        context: { value: 'not-a-mac-address' },
      })
    })

    it.each([
      ['00:1B:44:11:3A', 'too short'],
      ['00:1B:44:11:3A:B7:FF', 'too long'],
      ['00:1G:44:11:3A:B7', 'invalid hex character'],
      ['00:1B:44:11:3A:B7::', 'invalid format'],
      ['001B.4411.3AB7.FFFF', 'wrong dot format'],
      ['001B44113AB7FF', 'wrong length without separators'],
      ['00:1B-44:11.3A:B7', 'mixed separators'],
    ])('should throw for invalid MAC address format: %s (%s)', (mac) => {
      const shouldThrow = () => assertStringMacAddress(mac)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_MAC_ADDRESS',
        message: 'String is not a valid MAC address.',
        context: { value: mac },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringMacAddress({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is an empty string', () => {
      const shouldThrow = () => assertStringMacAddress('')
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
      const value: unknown = '00:1B:44:11:3A:B7'
      assertStringMacAddress(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
