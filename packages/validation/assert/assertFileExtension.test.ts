import { attempt } from '@unshared/functions'
import { assertFileExtension } from './assertFileExtension'
import { assertString } from './assertString'
import { assertStringEnum } from './assertStringEnum'
import { assertStringEquals } from './assertStringEquals'

describe('assertFileExtension', () => {
  describe('pass', () => {
    it('should pass if file extension passes the assertion', () => {
      const file = new File([''], 'image.jpg')
      const result = assertFileExtension(assertStringEquals('.jpg'))(file)
      expect(result).toBeUndefined()
    })

    it('should pass if file extension is one of allowed extensions', () => {
      const file = new File([''], 'image.png')
      const result = assertFileExtension(assertStringEnum(['.jpg', '.png', '.gif']))(file)
      expect(result).toBeUndefined()
    })

    it('should pass for file with no extension', () => {
      const file = new File([''], 'README')
      const result = assertFileExtension(assertStringEquals(''))(file)
      expect(result).toBeUndefined()
    })

    it('should pass for file with multiple dots', () => {
      const file = new File([''], 'archive.tar.gz')
      const result = assertFileExtension(assertStringEquals('.gz'))(file)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if file extension does not pass the assertion', () => {
      const file = new File([''], 'document.pdf')
      const shouldThrow = () => assertFileExtension(assertStringEquals('.jpg'))(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_EXTENSION_NOT_MATCHING',
        message: 'File extension ".pdf" does not pass the assertion.',
        context: { value: '.pdf', fileName: 'document.pdf', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_EQUAL',
        message: 'String is not equal to ".jpg".',
      })
    })

    it('should throw if file has no extension but assertion expects one', () => {
      const file = new File([''], 'README')
      const shouldThrow = () => assertFileExtension(assertStringEquals('.txt'))(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_EXTENSION_NOT_MATCHING',
        message: 'File extension "" does not pass the assertion.',
        context: { value: '', fileName: 'README', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_EQUAL',
        message: 'String is not equal to ".txt".',
      })
    })

    it('should throw if value is not a File', () => {
      const shouldThrow = () => assertFileExtension(assertString)('not a file' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FILE',
        message: 'Value is not a File.',
        context: { value: 'not a file', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a File with extension passing assertion', () => {
      const value = new File([''], 'image.jpg') as unknown
      const assertExtension: (value: unknown) => asserts value is File = assertFileExtension(assertStringEquals('.jpg'))
      assertExtension(value)
      expectTypeOf(value).toEqualTypeOf<File>()
    })
  })
})
