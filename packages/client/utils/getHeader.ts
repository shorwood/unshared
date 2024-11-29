/**
 * Get a header value from the `HeadersInit` object.
 *
 * @param headers The headers to get the key-value pair from.
 * @param key The key of the header to get.
 * @returns The value of the header.
 * @example
 * const headers = new Headers({ 'Content-Type': 'application/json' })
 * const contentType = getHeader(headers, 'Content-Type')
 * console.log(contentType) // 'application/json'
 */
export function getHeader(headers: HeadersInit, key: string): string | undefined {
  if (headers instanceof Headers) {
    return headers.get(key) ?? undefined
  }
  else if (Array.isArray(headers)) {
    const keyLower = key.toLowerCase()
    const header = headers.find(([k]) => k.toLowerCase() === keyLower)
    return header ? header[1] : undefined
  }
  else {
    const keyLower = key.toLowerCase()
    const keys = Object.keys(headers)
    const index = keys.findIndex(k => k.toLowerCase() === keyLower)
    return index === -1 ? undefined : headers[keys[index]]
  }
}
