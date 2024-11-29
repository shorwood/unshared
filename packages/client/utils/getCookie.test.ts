import { getCookie } from './getCookie'

describe('getCookie', () => {
  it('should get a cookie value from a Headers instance', () => {
    const headers = new Headers({ Cookie: 'key1=value1; key2=value2' })
    const value = getCookie(headers, 'key1')
    expect(value).toBe('value1')
  })

  it('should get a cookie value from an array of key-value pairs', () => {
    const headers: Array<[string, string]> = [['Cookie', 'key1=value1; key2=value2']]
    const value = getCookie(headers, 'key1')
    expect(value).toBe('value1')
  })

  it('should get a cookie value from an object', () => {
    const headers: Record<string, string> = { Cookie: 'key1=value1; key2=value2' }
    const value = getCookie(headers, 'key1')
    expect(value).toBe('value1')
  })

  it('should return undefined if the cookie is not found in a Headers instance', () => {
    const headers = new Headers()
    const value = getCookie(headers, 'key1')
    expect(value).toBeUndefined()
  })

  it('should return undefined if the cookie is not found in an array of key-value pairs', () => {
    const headers: Array<[string, string]> = []
    const value = getCookie(headers, 'key1')
    expect(value).toBeUndefined()
  })

  it('should return undefined if the cookie is not found in an object', () => {
    const headers: Record<string, string> = {}
    const value = getCookie(headers, 'key1')
    expect(value).toBeUndefined()
  })
})
