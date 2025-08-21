import { attempt } from '@unshared/functions'
import { assertStringUrl } from './assertStringUrl'

describe('assertStringUrl', () => {
  describe('pass', () => {
    it.each([
      ['a valid URL', 'https://example.com'],
      ['HTTP URLs', 'http://example.com'],
      ['URLs with paths', 'https://example.com/path/to/resource'],
      ['URLs with query parameters', 'https://example.com?param=value'],
      ['URLs with fragments', 'https://example.com#section'],
      ['file URLs', 'file:///path/to/file'],
      ['FTP URLs', 'ftp://example.com/file.txt'],
    ])('should pass for %s', (_, url) => {
      const result = assertStringUrl(url)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a valid URL', () => {
      const shouldThrow = () => assertStringUrl('not-a-url')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_URL',
        message: 'String is not a valid URL.',
        context: { value: 'not-a-url' },
      })
    })

    it('should throw if value is a relative path', () => {
      const shouldThrow = () => assertStringUrl('/path/to/resource')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_URL',
        message: 'String is not a valid URL.',
        context: { value: '/path/to/resource' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringUrl({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is an empty string', () => {
      const shouldThrow = () => assertStringUrl('')
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
      const value: unknown = 'https://example.com'
      assertStringUrl(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
