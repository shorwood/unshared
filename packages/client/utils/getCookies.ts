import { getHeader } from './getHeader'

/**
 * Extract the cookies from the `HeadersInit` object.
 *
 * @param headers The headers to extract the cookies from.
 * @returns An array of cookies.
 * @example
 * const headers = new Headers({ Cookie: 'key1=value1; key2=value2' })
 * const cookies = getCookies(headers) // { key1: 'value1', key2: 'value2' }
 */
export function getCookies(headers: HeadersInit): Record<string, string> {
  const value = getHeader(headers, 'Cookie')
  if (!value) return {}

  // --- Parse the cookie header.
  const cookies: Record<string, string> = {}
  const parts = value.split(';')
  for (const part of parts) {
    const [key, value] = part.trim().split('=').map(v => v.trim())
    if (!key || !value) continue
    cookies[key] = value
  }

  // --- Return the cookies.
  return cookies
}
