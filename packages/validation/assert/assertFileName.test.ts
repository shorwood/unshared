import { attempt } from '@unshared/functions'
import { assertFileName } from './assertFileName'
import { assertString } from './assertString'
import { assertStringEndingWith } from './assertStringEndingWith'
import { assertStringStartingWith } from './assertStringStartingWith'

describe('assertFileName', () => {
  describe('pass', () => {
    it('should pass if file name passes the assertion', () => {
      const file = new File([''], 'image.jpg')
      const result = assertFileName(assertString)(file)
      expect(result).toBeUndefined()
    })

    it('should pass if file name starts with expected prefix', () => {
      const file = new File([''], 'image_photo.jpg')
      const result = assertFileName(assertStringStartingWith('image'))(file)
      expect(result).toBeUndefined()
    })

    it('should pass if file name ends with expected suffix', () => {
      const file = new File([''], 'photo.jpg')
      const result = assertFileName(assertStringEndingWith('.jpg'))(file)
      expect(result).toBeUndefined()
    })

    it('should pass if file name matches multiple assertions', () => {
      const file = new File([''], 'image_photo.jpg')
      const result = assertFileName(
        assertStringStartingWith('image'),
        assertStringEndingWith('.jpg'),
      )(file)
      expect(result).toBeUndefined()
    })

    it('should pass if file name matches the RegExp assertion', () => {
      const file = new File([''], 'image_123.jpg')
      const result = assertFileName(/image_\d+\.jpg/)(file)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if file name does not pass the assertion', () => {
      const file = new File([''], 'document.pdf')
      const shouldThrow = () => assertFileName(assertStringStartingWith('image'))(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_NAME_NOT_MATCHING',
        message: 'File name "document.pdf" does not pass the assertion.',
        context: { value: 'document.pdf', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_STARTING_WITH',
        message: 'String does not start with "image".',
      })
    })

    it('should throw if value is not a File', () => {
      const shouldThrow = () => assertFileName(assertString)('not a file' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FILE',
        message: 'Value is not a File.',
        context: { value: 'not a file', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a File with name passing assertion', () => {
      const value = new File([''], 'image.jpg') as unknown
      const assertName: (value: unknown) => asserts value is File = assertFileName(assertString)
      assertName(value)
      expectTypeOf(value).toEqualTypeOf<File>()
    })
  })
})
