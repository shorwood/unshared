import { getFileUrl } from './getFileUrl'

describe('getFileUrl', () => {
  test('should return the URL of a file', () => {
    const file = new File([''], 'file.txt', { type: 'text/plain' })
    const result = getFileUrl(file)
    expect(result).toMatch(/^blob:nodedata:[\da-z-]{8}(-[\da-z-]{4}){3}-[\da-z-]{12}$/)
  })

  test('should return the URL of a string', () => {
    const url = 'https://example.com/image.png'
    const result = getFileUrl(url)
    expect(result).toBe(url)
  })

  test('should return an empty string', () => {
    const result = getFileUrl()
    expect(result).toBeUndefined()
  })
})
