import { attempt } from '@unshared/functions'
import { assertFileType } from './assertFileType'
import { assertString } from './assertString'
import { assertStringEnum } from './assertStringEnum'
import { assertStringEquals } from './assertStringEquals'
import { assertStringStartingWith } from './assertStringStartingWith'

describe('assertFileType', () => {
  describe('pass', () => {
    it('should pass if file type passes the assertion', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const result = assertFileType(assertStringEquals('image/jpeg'))(file)
      expect(result).toBeUndefined()
    })

    it('should pass if file type starts with expected prefix', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const result = assertFileType(assertStringStartingWith('image/'))(file)
      expect(result).toBeUndefined()
    })

    it('should pass if file type is one of allowed types', () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      const result = assertFileType(assertStringEnum(['image/jpeg', 'image/png', 'image/gif']))(file)
      expect(result).toBeUndefined()
    })

    it('should pass for any string type', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' })
      const result = assertFileType(assertString)(file)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if file type does not pass the assertion', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' })
      const shouldThrow = () => assertFileType(assertStringEquals('image/jpeg'))(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_TYPE_NOT_MATCHING',
        message: 'File type "text/plain" does not pass the assertion.',
        context: { value: 'text/plain', fileName: 'test.txt', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_EQUAL',
        message: 'String is not equal to "image/jpeg".',
      })
    })

    it('should throw if file type does not start with expected prefix', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' })
      const shouldThrow = () => assertFileType(assertStringStartingWith('image/'))(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_TYPE_NOT_MATCHING',
        message: 'File type "text/plain" does not pass the assertion.',
        context: { value: 'text/plain', fileName: 'test.txt', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_STARTING_WITH',
        message: 'String does not start with "image/".',
      })
    })

    it('should throw if file type is not in allowed enum', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' })
      const shouldThrow = () => assertFileType(assertStringEnum(['image/jpeg', 'image/png']))(file)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_FILE_TYPE_NOT_MATCHING',
        message: 'File type "text/plain" does not pass the assertion.',
        context: { value: 'text/plain', fileName: 'test.txt', received: 'string' },
      })
      expect(error?.cause).toMatchObject({
        name: 'E_STRING_NOT_ONE_OF_VALUES',
        message: 'String is not one of the values: \'image/jpeg\', \'image/png\'.',
      })
    })

    it('should throw if value is not a File', () => {
      const shouldThrow = () => assertFileType(assertString)('not a file' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FILE',
        message: 'Value is not a File.',
        context: { value: 'not a file', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate a File with type passing assertion', () => {
      const value = new File([''], 'test.jpg', { type: 'image/jpeg' }) as unknown
      const assertType: (value: unknown) => asserts value is File = assertFileType(assertStringEquals('image/jpeg'))
      assertType(value)
      expectTypeOf(value).toEqualTypeOf<File>()
    })
  })
})
