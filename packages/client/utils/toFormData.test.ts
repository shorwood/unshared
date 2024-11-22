import { toFormData } from './toFormData'

describe('toFormData', () => {
  it('should return a FormData instance', () => {
    const formData = toFormData({})
    expect(formData).toBeInstanceOf(FormData)
  })

  it('should return the same FormData instance if already provided', () => {
    const formData = new FormData()
    const result = toFormData(formData)
    expect(result).toBe(formData)
  })

  it('should convert an object with Blob values to FormData', () => {
    const file = new Blob(['test'], { type: 'text/plain' })
    const formData = toFormData({ file })
    const [name, value] = formData.entries().next().value!
    expect(name).toBe('file')
    expect(value).toStrictEqual(new File([file], 'blob', { type: 'text/plain' }))
  })

  it('should convert an object with File values to FormData', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const formData = toFormData({ file })
    const [name, value] = formData.entries().next().value!
    expect(name).toBe('file')
    expect(value).toBe(file)
  })

  it('should convert an object with FileList values to FormData', () => {
    const file1 = new File(['test1'], 'test1.txt', { type: 'text/plain' })
    const file2 = new File(['test2'], 'test2.txt', { type: 'text/plain' })
    const fileList = [file1, file2] as unknown as FileList
    const formData = toFormData({ files: fileList })
    expect(formData.getAll('files')).toEqual([file1, file2])
  })

  it('should handle undefined values in the object', () => {
    // @ts-expect-error: intentionally passing undefined
    const formData = toFormData({ file: undefined })
    expect(formData.entries().next().done).toBe(true)
  })

  it('should handle empty object', () => {
    const formData = toFormData({})
    expect(formData.entries().next().done).toBe(true)
  })

  it('should handle mixed types in the object', () => {
    const blob = new Blob(['test'], { type: 'text/plain' })
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileList = [file] as unknown as FileList
    const formData = toFormData({ blob, file, files: fileList })
    const entries = [...formData.entries()]
    expect(entries).toHaveLength(3)
    expect(entries).toStrictEqual([
      ['blob', new File([blob], 'blob', { type: 'text/plain' })],
      ['file', file],
      ['files', file],
    ])
  })
})
