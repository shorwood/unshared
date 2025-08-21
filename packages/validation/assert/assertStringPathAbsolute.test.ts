import { attempt } from '@unshared/functions'
import { assertStringPathAbsolute } from './assertStringPathAbsolute'

describe('assertStringPathAbsolute', () => {
  describe('pass', () => {
    it('should pass if value is a valid absolute UNIX path', () => {
      const result = assertStringPathAbsolute('/home/user/file.txt')
      expect(result).toBeUndefined()
    })

    it('should pass if value is root path', () => {
      const result = assertStringPathAbsolute('/')
      expect(result).toBeUndefined()
    })

    it('should pass if value is an absolute path with special characters', () => {
      const result = assertStringPathAbsolute('/path/with spaces/and-dashes_and.dots')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is a relative path', () => {
      const shouldThrow = () => assertStringPathAbsolute('relative/path/file.txt')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_ABSOLUTE_PATH',
        message: 'String is not an absolute UNIX path.',
        context: { value: 'relative/path/file.txt' },
      })
    })

    it('should throw if value is just a filename', () => {
      const shouldThrow = () => assertStringPathAbsolute('file.txt')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_ABSOLUTE_PATH',
        message: 'String is not an absolute UNIX path.',
        context: { value: 'file.txt' },
      })
    })

    it('should throw if value contains null byte', () => {
      const shouldThrow = () => assertStringPathAbsolute('/path/with\0null')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_PATH',
        message: 'String is not a valid UNIX path.',
        context: { value: '/path/with\0null' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringPathAbsolute({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is an empty string', () => {
      const shouldThrow = () => assertStringPathAbsolute('')
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
      const value: unknown = '/home/user/file.txt'
      assertStringPathAbsolute(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
