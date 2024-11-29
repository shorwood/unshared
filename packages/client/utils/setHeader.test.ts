import { setHeader } from './setHeader'

describe('setHeader', () => {
  it('should set a header in a Headers instance', () => {
    const headers = new Headers()
    setHeader(headers, 'Content-Type', 'application/json')
    expect(headers.get('Content-Type')).toBe('application/json')
  })

  it('should set a header in an array of key-value pairs', () => {
    const headers: Array<[string, string]> = []
    setHeader(headers, 'Content-Type', 'application/json')
    expect([...headers]).toStrictEqual([['Content-Type', 'application/json']])
  })

  it('should set a header in an object', () => {
    const headers: Record<string, string> = {}
    setHeader(headers, 'Content-Type', 'application/json')
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('should replace a header with the same key but different case', () => {
    const headers = new Headers({ 'content-type': 'text/plain' })
    setHeader(headers, 'Content-Type', 'application/json')
    expect(headers.get('Content-Type')).toBe('application/json')
  })

  it('should replace a header in an array of key-value pairs with the same key but different case', () => {
    const headers: Array<[string, string]> = [['content-type', 'text/plain']]
    setHeader(headers, 'Content-Type', 'application/json')
    expect(headers).toEqual([['Content-Type', 'application/json']])
  })

  it('should replace a header in an object with the same key but different case', () => {
    const headers: Record<string, string> = { 'content-type': 'text/plain' }
    setHeader(headers, 'Content-Type', 'application/json')
    expect(headers['content-type']).toBe('application/json')
  })
})
