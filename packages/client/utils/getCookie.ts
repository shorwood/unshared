import { getCookies } from './getCookies'

/**
 * Get a cookie value from the `HeadersInit` object.
 *
 * @param headers The headers to get the cookie value from.
 * @param key The key of the cookie to get.
 * @returns The value of the cookie.
 * @example
 * const headers = new Headers({ Cookie: 'key1=value1; key2=value2' })
 * const value = getCookie(headers, 'key1')
 */
export function getCookie(headers: HeadersInit, key: string): string | undefined {
  const cookie = getCookies(headers)
  if (!cookie) return
  return cookie[key]
}
