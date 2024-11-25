import type { FormDataLike } from './isFormDataLike'
import { isFormDataLike } from './isFormDataLike'

describe('isFormDataLike', () => {
  it('should return true for an object with File values', () => {
    const file = new File(['content'], 'test.txt')
    const result = isFormDataLike({ file })
    expect(result).toBe(true)
  })
  it('should return true for an object with Blob values', () => {
    const blob = new Blob(['content'], { type: 'text/plain' })
    const result = isFormDataLike({ blob })
    expect(result).toBe(true)
  })

  it('should return true for an object with FileList values', () => {
    const file = new File(['content'], 'test.txt')
    const fileList = [file] as unknown as FileList
    const result = isFormDataLike({ files: fileList })
    expect(result).toBe(true)
  })

  it('should return false for an object with non-Blob/File values', () => {
    const result = isFormDataLike({ text: 'string' })
    expect(result).toBe(false)
  })

  it('should return true for a FormData instance', () => {
    const result = isFormDataLike(new FormData())
    expect(result).toBe(true)
  })

  it('should return false for null', () => {
    const result = isFormDataLike(null)
    expect(result).toBe(false)
  })

  it('should return false for undefined', () => {
    const result = isFormDataLike(undefined)
    expect(result).toBe(false)
  })

  it('should return false for a string', () => {
    const result = isFormDataLike('string')
    expect(result).toBe(false)
  })

  it('should return false for a number', () => {
    const result = isFormDataLike(123)
    expect(result).toBe(false)
  })

  it('should return false for a boolean', () => {
    const result = isFormDataLike(true)
    expect(result).toBe(false)
  })

  it('should return false for an empty object', () => {
    const result = isFormDataLike({})
    expect(result).toBe(false)
  })

  it('should infer a `FormDataLike` type', () => {
    const value = {} as unknown
    const result = isFormDataLike(value)
    if (result) expectTypeOf(value).toEqualTypeOf<FormDataLike>()
  })
})
