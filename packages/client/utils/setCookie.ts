import { getCookies } from './getCookies'
import { setHeader } from './setHeader'

/**
 * Set a cookie in the `HeadersInit` object.
 *
 * @param headers The headers to set the cookie in.
 * @param key The key of the cookie to set.
 * @param value The value of the cookie to set.
 * @example
 * const headers = new Headers()
 * const cookie = { key: 'key1', value: 'value1', path: '/', secure: true }
 * setCookie(headers, cookie)
 * console.log(headers.get('Cookie')) // 'key1=value1; Path=/; Secure'
 */
export function setCookie(headers: HeadersInit, key: string, value: string): void {
  const cookies = { ...getCookies(headers), [key]: value }
  const header = Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ')
  setHeader(headers, 'Cookie', header)
}
