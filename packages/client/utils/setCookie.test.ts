import { getHeader } from './getHeader'
import { setCookie } from './setCookie'

describe('setCookie', () => {
  it('should set a cookie in a Headers instance', () => {
    const headers = new Headers()
    setCookie(headers, 'key1', 'value1')
    const header = getHeader(headers, 'Cookie')
    expect(header).toBe('key1=value1')
  })

  it('should append a new cookie to existing cookies', () => {
    const headers = new Headers({ Cookie: 'key1=value1' })
    setCookie(headers, 'key2', 'value2')
    const header = getHeader(headers, 'Cookie')
    expect(header).toBe('key1=value1; key2=value2')
  })

  it('should overwrite an existing cookie with the same key and case', () => {
    const headers = new Headers({ Cookie: 'key1=value1' })
    setCookie(headers, 'key1', 'value2')
    const header = getHeader(headers, 'Cookie')
    expect(header).toBe('key1=value2')
  })

  it('should create a new cookie when the case is different', () => {
    const headers = new Headers({ Cookie: 'key1=value1' })
    setCookie(headers, 'KEY1', 'value2')
    const header = getHeader(headers, 'Cookie')
    expect(header).toBe('key1=value1; KEY1=value2')
  })
})
