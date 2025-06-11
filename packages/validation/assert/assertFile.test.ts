import { attempt } from '@unshared/functions'
import { assertFile } from './assertFile'

describe('assertFile', () => {
  describe('pass', () => {
    it('should pass if value is a File', () => {
      const file = new File([''], 'test.txt')
      const result = assertFile(file)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a File', () => {
      const shouldThrow = () => assertFile('not a file')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FILE',
        message: 'Value is not a File.',
        context: { value: 'not a file', received: 'string' },
      })
    })

    it('should throw if value is null', () => {
      const shouldThrow = () => assertFile(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FILE',
        message: 'Value is not a File.',
        context: { value: null, received: 'null' },
      })
    })

    it('should throw if value is an object but not a File', () => {
      const shouldThrow = () => assertFile({ name: 'test.txt' })
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FILE',
        message: 'Value is not a File.',
        context: { value: { name: 'test.txt' }, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a File', () => {
      const value = new File([''], 'test.txt') as unknown
      assertFile(value)
      expectTypeOf(value).toEqualTypeOf<File>()
    })
  })
})
