import { getCookies } from './getCookies'

describe('getCookies', () => {
  it('should extract cookies from a Headers instance', () => {
    const headers = new Headers({ Cookie: 'key1=value1; key2=value2' })
    const cookies = getCookies(headers)
    expect(cookies).toEqual({ key1: 'value1', key2: 'value2' })
  })

  it('should extract cookies from an array of key-value pairs', () => {
    const headers: Array<[string, string]> = [['Cookie', 'key1=value1; key2=value2']]
    const cookies = getCookies(headers)
    expect(cookies).toEqual({ key1: 'value1', key2: 'value2' })
  })

  it('should extract cookies from an object', () => {
    const headers: Record<string, string> = { Cookie: 'key1=value1; key2=value2' }
    const cookies = getCookies(headers)
    expect(cookies).toEqual({ key1: 'value1', key2: 'value2' })
  })

  it('should return an empty object if no cookies are found in a Headers instance', () => {
    const headers = new Headers()
    const cookies = getCookies(headers)
    expect(cookies).toEqual({})
  })

  it('should return an empty object if no cookies are found in an array of key-value pairs', () => {
    const headers: Array<[string, string]> = []
    const cookies = getCookies(headers)
    expect(cookies).toEqual({})
  })

  it('should return an empty object if no cookies are found in an object', () => {
    const headers: Record<string, string> = {}
    const cookies = getCookies(headers)
    expect(cookies).toEqual({})
  })
})
