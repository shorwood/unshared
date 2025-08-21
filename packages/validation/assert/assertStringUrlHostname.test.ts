import { attempt } from '@unshared/functions'
import { assertString } from './assertString'
import { assertStringEnum } from './assertStringEnum'
import { assertStringEquals } from './assertStringEquals'
import { assertStringStartingWith } from './assertStringStartingWith'
import { assertStringUrlHostname } from './assertStringUrlHostname'

describe('assertStringUrlHostname', () => {
  describe('pass', () => {
    it('should pass if URL hostname equals the expected string', () => {
      const result = assertStringUrlHostname('example.com')('https://example.com/path')
      expect(result).toBeUndefined()
    })

    it('should pass if URL hostname passes the assertion function', () => {
      const result = assertStringUrlHostname(assertStringEquals('example.com'))('https://example.com/path')
      expect(result).toBeUndefined()
    })

    it('should pass if URL hostname starts with expected prefix', () => {
      const result = assertStringUrlHostname(assertStringStartingWith('api.'))('https://api.example.com/path')
      expect(result).toBeUndefined()
    })

    it('should pass if URL hostname is one of allowed hostnames', () => {
      const result = assertStringUrlHostname(assertStringEnum(['example.com', 'test.com', 'demo.com']))('https://example.com/path')
      expect(result).toBeUndefined()
    })

    it('should pass for any string hostname', () => {
      const result = assertStringUrlHostname(assertString)('https://any-hostname.com/path')
      expect(result).toBeUndefined()
    })

    it('should work with different URL schemes', () => {
      const result = assertStringUrlHostname('example.com')('http://example.com')
      expect(result).toBeUndefined()
    })

    it('should work with URLs containing ports', () => {
      const result = assertStringUrlHostname('localhost')('http://localhost:3000/path')
      expect(result).toBeUndefined()
    })

    it('should work with subdomains', () => {
      const result = assertStringUrlHostname('www.example.com')('https://www.example.com/path')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if URL hostname does not equal the expected string', () => {
      const shouldThrow = () => assertStringUrlHostname('example.com')('https://different.com/path')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_URL_HOSTNAME_NOT_MATCHING',
        message: 'URL hostname "different.com" does not pass the assertion.',
        context: { value: 'different.com', url: 'https://different.com/path', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_EQUAL',
        message: 'String is not equal to "example.com".',
      })
    })

    it('should throw if URL hostname does not pass the assertion function', () => {
      const shouldThrow = () => assertStringUrlHostname(assertStringEquals('example.com'))('https://different.com/path')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_URL_HOSTNAME_NOT_MATCHING',
        message: 'URL hostname "different.com" does not pass the assertion.',
        context: { value: 'different.com', url: 'https://different.com/path', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_EQUAL',
        message: 'String is not equal to "example.com".',
      })
    })

    it('should throw if URL hostname does not start with expected prefix', () => {
      const shouldThrow = () => assertStringUrlHostname(assertStringStartingWith('api.'))('https://web.example.com/path')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_URL_HOSTNAME_NOT_MATCHING',
        message: 'URL hostname "web.example.com" does not pass the assertion.',
        context: { value: 'web.example.com', url: 'https://web.example.com/path', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_STARTING_WITH',
        message: 'String does not start with "api.".',
      })
    })

    it('should throw if URL hostname is not in allowed enum', () => {
      const shouldThrow = () => assertStringUrlHostname(assertStringEnum(['example.com', 'test.com']))('https://different.com/path')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_URL_HOSTNAME_NOT_MATCHING',
        message: 'URL hostname "different.com" does not pass the assertion.',
        context: { value: 'different.com', url: 'https://different.com/path', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_ONE_OF_VALUES',
        message: 'String is not one of the values: \'example.com\', \'test.com\'.',
      })
    })

    it('should throw if value is not a valid URL', () => {
      const shouldThrow = () => assertStringUrlHostname('example.com')('not a url')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_URL',
        message: 'String is not a valid URL.',
        context: { value: 'not a url' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringUrlHostname('example.com')(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a string URL with hostname passing assertion', () => {
      const value = 'https://example.com/path' as unknown
      const assertType: (value: unknown) => asserts value is string = assertStringUrlHostname('example.com')
      assertType(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })

    it('should predicate a string URL with hostname passing function assertion', () => {
      const value = 'https://api.example.com/path' as unknown
      const assertType: (value: unknown) => asserts value is string = assertStringUrlHostname(assertStringStartingWith('api.'))
      assertType(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
