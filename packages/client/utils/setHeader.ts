/**
 * Set a header in the `HeadersInit` object whether it is a `Headers` instance, an
 * array of key-value pairs, or an object. It is also case-insensitive, meaning that
 * if a header with the same key but different case is found, it will be replaced.
 *
 * @param headers The headers to set the key-value pair in.
 * @param key The key of the header to set.
 * @param value The value of the header to set.
 * @example
 * const headers = new Headers()
 * setHeader(headers, 'Content-Type', 'application/json')
 * console.log(headers.get('Content-Type')) // 'application/json'
 */
export function setHeader(headers: HeadersInit, key: string, value: number | string): void {
  value = String(value)
  if (headers instanceof Headers) {
    headers.set(key, value)
  }
  else if (Array.isArray(headers)) {
    const keyLower = key.toLowerCase()
    const index = headers.findIndex(([k]) => k.toLowerCase() === keyLower)
    if (index === -1) headers.push([key, value])
    headers[index] = [key, value]
  }
  else {
    const keyLower = key.toLowerCase()
    const keys = Object.keys(headers)
    const index = keys.findIndex(k => k.toLowerCase() === keyLower)
    if (index === -1) headers[key] = value
    headers[keys[index]] = value
  }
}
