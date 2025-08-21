import { attempt } from '@unshared/functions'
import { assertStringPath } from './assertStringPath'

describe('assertStringPath', () => {
  describe('pass', () => {
    it('should pass if value is a valid absolute UNIX path', () => {
      const result = assertStringPath('/home/user/file.txt')
      expect(result).toBeUndefined()
    })

    it('should pass if value is a valid relative UNIX path', () => {
      const result = assertStringPath('relative/path/file.txt')
      expect(result).toBeUndefined()
    })

    it('should pass if value is a simple filename', () => {
      const result = assertStringPath('file.txt')
      expect(result).toBeUndefined()
    })

    it('should pass if value is a path with special characters', () => {
      const result = assertStringPath('/path/with spaces/and-dashes_and.dots')
      expect(result).toBeUndefined()
    })

    it('should pass if value is root path', () => {
      const result = assertStringPath('/')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value contains null byte', () => {
      const shouldThrow = () => assertStringPath('/path/with\0null')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_PATH',
        message: 'String is not a valid UNIX path.',
        context: { value: '/path/with\0null' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringPath({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is an empty string', () => {
      const shouldThrow = () => assertStringPath('')
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
      assertStringPath(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
