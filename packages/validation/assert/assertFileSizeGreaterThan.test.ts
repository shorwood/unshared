import { attempt } from '@unshared/functions'
import { assertFileSizeGreaterThan } from './assertFileSizeGreaterThan'

describe('assertFileSizeGreaterThan', () => {
  describe('pass', () => {
    it('should pass if file size is greater than minimum', () => {
      const file = new File(['hello world'], 'test.txt') // 11 bytes
      const result = assertFileSizeGreaterThan(5)(file)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if file size is equal to minimum', () => {
      const file = new File(['hello'], 'test.txt') // 5 bytes
      const shouldThrow = () => assertFileSizeGreaterThan(5)(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_SIZE_NOT_GREATER_THAN',
        message: 'File size of test.txt (5 bytes) is not greater than 5 bytes.',
        context: { value: 5, minimum: 5 },
      })
    })

    it('should throw if file size is less than minimum', () => {
      const file = new File(['hi'], 'test.txt') // 2 bytes
      const shouldThrow = () => assertFileSizeGreaterThan(5)(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_SIZE_NOT_GREATER_THAN',
        message: 'File size of test.txt (2 bytes) is not greater than 5 bytes.',
        context: { value: 2, minimum: 5 },
      })
    })

    it('should throw if value is not a File', () => {
      const shouldThrow = () => assertFileSizeGreaterThan(5)('not a file' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FILE',
        message: 'Value is not a File.',
        context: { value: 'not a file', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a File with size greater than minimum', () => {
      const value = new File(['hello world'], 'test.txt') as unknown
      const assertSize: (value: unknown) => asserts value is File = assertFileSizeGreaterThan(5)
      assertSize(value)
      expectTypeOf(value).toEqualTypeOf<File>()
    })
  })
})
