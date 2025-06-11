import { attempt } from '@unshared/functions'
import { assertFileSizeLowerThan } from './assertFileSizeLowerThan'

describe('assertFileSizeLowerThan', () => {
  describe('pass', () => {
    it('should pass if file size is lower than maximum', () => {
      const file = new File(['hello'], 'test.txt') // 5 bytes
      const result = assertFileSizeLowerThan(10)(file)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if file size is equal to maximum', () => {
      const file = new File(['hello'], 'test.txt') // 5 bytes
      const shouldThrow = () => assertFileSizeLowerThan(5)(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_SIZE_NOT_LOWER_THAN',
        message: 'File size of test.txt (5 bytes) is not lower than 5 bytes.',
        context: { value: 5, maximum: 5 },
      })
    })

    it('should throw if file size is greater than maximum', () => {
      const file = new File(['hello world'], 'test.txt') // 11 bytes
      const shouldThrow = () => assertFileSizeLowerThan(10)(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_SIZE_NOT_LOWER_THAN',
        message: 'File size of test.txt (11 bytes) is not lower than 10 bytes.',
        context: { value: 11, maximum: 10 },
      })
    })

    it('should throw if value is not a File', () => {
      const shouldThrow = () => assertFileSizeLowerThan(10)('not a file' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FILE',
        message: 'Value is not a File.',
        context: { value: 'not a file', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a File with size lower than maximum', () => {
      const value = new File(['hello'], 'test.txt') as unknown
      const assertSize: (value: unknown) => asserts value is File = assertFileSizeLowerThan(10)
      assertSize(value)
      expectTypeOf(value).toEqualTypeOf<File>()
    })
  })
})
