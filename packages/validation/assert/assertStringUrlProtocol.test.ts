import { attempt } from '@unshared/functions'
import { assertStringUrlProtocol } from './assertStringUrlProtocol'

describe('assertStringUrlProtocol', () => {
  describe('pass', () => {
    it('should pass if URL has an allowed protocol', () => {
      const assertHttps = assertStringUrlProtocol('https')
      const result = assertHttps('https://example.com')
      expect(result).toBeUndefined()
    })

    it('should pass if URL has one of multiple allowed protocols', () => {
      const assertWebProtocols = assertStringUrlProtocol('http', 'https')
      const result1 = assertWebProtocols('http://example.com')
      const result2 = assertWebProtocols('https://example.com')
      expect(result1).toBeUndefined()
      expect(result2).toBeUndefined()
    })

    it('should pass for custom protocols', () => {
      const assertCustom = assertStringUrlProtocol('ftp', 'sftp')
      const result = assertCustom('ftp://example.com/file.txt')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if URL has a disallowed protocol', () => {
      const assertHttpsOnly = assertStringUrlProtocol('https')
      const shouldThrow = () => assertHttpsOnly('http://example.com')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_URL_INVALID_PROTOCOL',
        message: 'URL protocol "http" is not one of the allowed protocols: https.',
        context: {
          value: 'http://example.com',
          protocol: 'http',
          allowedProtocols: ['https'],
        },
      })
    })

    it('should throw if URL protocol is not in the allowed list', () => {
      const assertWebOnly = assertStringUrlProtocol('http', 'https')
      const shouldThrow = () => assertWebOnly('ftp://example.com/file.txt')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_URL_INVALID_PROTOCOL',
        message: 'URL protocol "ftp" is not one of the allowed protocols: http, https.',
        context: {
          value: 'ftp://example.com/file.txt',
          protocol: 'ftp',
          allowedProtocols: ['http', 'https'],
        },
      })
    })

    it('should throw if value is not a valid URL', () => {
      const assertHttps = assertStringUrlProtocol('https')
      const shouldThrow = () => assertHttps('not-a-url')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_URL',
        message: 'String is not a valid URL.',
        context: { value: 'not-a-url' },
      })
    })

    it('should throw if value is not a string', () => {
      const assertHttps = assertStringUrlProtocol('https')
      const shouldThrow = () => assertHttps({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a string', () => {
      const value: unknown = 'https://example.com'
      const assertHttps: (value: unknown) => asserts value is string = assertStringUrlProtocol('https')
      assertHttps(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
