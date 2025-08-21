import { attempt } from '@unshared/functions'
import { assertStringPathRelative } from './assertStringPathRelative'

describe('assertStringPathRelative', () => {
  describe('pass', () => {
    it('should pass if value is a valid relative UNIX path', () => {
      const result = assertStringPathRelative('relative/path/file.txt')
      expect(result).toBeUndefined()
    })

    it('should pass if value is just a filename', () => {
      const result = assertStringPathRelative('file.txt')
      expect(result).toBeUndefined()
    })

    it('should pass if value is a relative path with special characters', () => {
      const result = assertStringPathRelative('path/with spaces/and-dashes_and.dots')
      expect(result).toBeUndefined()
    })

    it('should pass if value is a current directory reference', () => {
      const result = assertStringPathRelative('./file.txt')
      expect(result).toBeUndefined()
    })

    it('should pass if value is a parent directory reference', () => {
      const result = assertStringPathRelative('../file.txt')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is an absolute path', () => {
      const shouldThrow = () => assertStringPathRelative('/home/user/file.txt')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_RELATIVE_PATH',
        message: 'String is not a relative UNIX path.',
        context: { value: '/home/user/file.txt' },
      })
    })

    it('should throw if value is root path', () => {
      const shouldThrow = () => assertStringPathRelative('/')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_RELATIVE_PATH',
        message: 'String is not a relative UNIX path.',
        context: { value: '/' },
      })
    })

    it('should throw if value contains null byte', () => {
      const shouldThrow = () => assertStringPathRelative('path/with\0null')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_PATH',
        message: 'String is not a valid UNIX path.',
        context: { value: 'path/with\0null' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringPathRelative({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is an empty string', () => {
      const shouldThrow = () => assertStringPathRelative('')
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
      const value: unknown = 'relative/path/file.txt'
      assertStringPathRelative(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
