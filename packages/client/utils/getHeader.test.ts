import { getHeader } from './getHeader'

describe('getHeader', () => {
  it('should get a header value from a Headers instance', () => {
    const headers = new Headers({ 'Content-Type': 'application/json' })
    const contentType = getHeader(headers, 'Content-Type')
    expect(contentType).toBe('application/json')
  })

  it('should get a header value from an array of key-value pairs', () => {
    const headers: Array<[string, string]> = [['Content-Type', 'application/json']]
    const contentType = getHeader(headers, 'Content-Type')
    expect(contentType).toBe('application/json')
  })

  it('should get a header value from an object', () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const contentType = getHeader(headers, 'Content-Type')
    expect(contentType).toBe('application/json')
  })

  it('should return undefined if the header is not found in a Headers instance', () => {
    const headers = new Headers()
    const contentType = getHeader(headers, 'Content-Type')
    expect(contentType).toBeUndefined()
  })

  it('should return undefined if the header is not found in an array of key-value pairs', () => {
    const headers: Array<[string, string]> = []
    const contentType = getHeader(headers, 'Content-Type')
    expect(contentType).toBeUndefined()
  })

  it('should return undefined if the header is not found in an object', () => {
    const headers: Record<string, string> = {}
    const contentType = getHeader(headers, 'Content-Type')
    expect(contentType).toBeUndefined()
  })
})
