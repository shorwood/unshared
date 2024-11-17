import { HttpMethod } from './httpMethod'

/**
 * Checks if the given string is a valid HTTP method.
 *
 * @param method The string to check.
 * @returns `true` if the string is a valid HTTP method, `false` otherwise.
 * @example isHttpMethod('GET') // true
 */
export function isHttpMethod(method: string): method is HttpMethod {
  const upperCaseMethod = method.toUpperCase()
  return Object.keys(HttpMethod).includes(upperCaseMethod)
}

/* v8 ignore start */
if (import.meta.vitest) {
  const httpMethodsUpper = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE']
  const httpMethodsLower = httpMethodsUpper.map(method => method.toLowerCase())

  it.each(httpMethodsUpper)('should return true for %s', (method) => {
    const result = isHttpMethod(method)
    expect(result).toEqual(true)
  })

  it.each(httpMethodsLower)('should return true for %s', (method) => {
    const result = isHttpMethod(method)
    expect(result).toEqual(true)
  })

  it('should predicate the method is an `HttpMethod`', () => {
    const method = 'GET' as string
    const result = isHttpMethod(method)
    if (result) expectTypeOf(method).toMatchTypeOf<HttpMethod>()
  })

  it('should return false for invalid values', () => {
    const result = isHttpMethod('invalid')
    expect(result).toEqual(false)
  })
}
