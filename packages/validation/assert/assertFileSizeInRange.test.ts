import { attempt } from '@unshared/functions'
import { assertFileSizeInRange } from './assertFileSizeInRange'

describe('assertFileSizeInRange', () => {
  describe('pass', () => {
    it('should pass if file size is within range', () => {
      const file = new File(['hello'], 'test.txt') // 5 bytes
      const result = assertFileSizeInRange(3, 10)(file)
      expect(result).toBeUndefined()
    })

    it('should pass if file size equals minimum', () => {
      const file = new File(['hello'], 'test.txt') // 5 bytes
      const result = assertFileSizeInRange(5, 10)(file)
      expect(result).toBeUndefined()
    })

    it('should pass if file size equals maximum', () => {
      const file = new File(['hello'], 'test.txt') // 5 bytes
      const result = assertFileSizeInRange(3, 5)(file)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if file size is less than minimum', () => {
      const file = new File(['hi'], 'test.txt') // 2 bytes
      const shouldThrow = () => assertFileSizeInRange(5, 10)(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_SIZE_OUT_OF_RANGE',
        message: 'File size of test.txt (2 bytes) is not between 5 and 10 bytes.',
        context: { value: 2, min: 5, max: 10 },
      })
    })

    it('should throw if file size is greater than maximum', () => {
      const file = new File(['hello world!!!'], 'test.txt') // 14 bytes
      const shouldThrow = () => assertFileSizeInRange(5, 10)(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_SIZE_OUT_OF_RANGE',
        message: 'File size of test.txt (14 bytes) is not between 5 and 10 bytes.',
        context: { value: 14, min: 5, max: 10 },
      })
    })

    it('should throw if value is not a File', () => {
      const shouldThrow = () => assertFileSizeInRange(5, 10)('not a file' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FILE',
        message: 'Value is not a File.',
        context: { value: 'not a file', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a File with size in range', () => {
      const value = new File(['hello'], 'test.txt') as unknown
      const assertSize: (value: unknown) => asserts value is File = assertFileSizeInRange(3, 10)
      assertSize(value)
      expectTypeOf(value).toEqualTypeOf<File>()
    })
  })
})
