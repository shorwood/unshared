import { parseRequestToken } from './parseRequestToken'

describe('parseRequestToken', () => {
  it('should append the token to the query parameters', () => {
    const context = { url: new URL('https://example.com') }
    parseRequestToken(context, { token: 'my-token', tokenLocation: 'query', tokenProperty: 'token' })
    expect(context.url.searchParams.get('token')).toBe('my-token')
  })

  it('should append the token to the Authorization header by default and prepend with Bearer', () => {
    const context = { init: { headers: new Headers() } }
    parseRequestToken(context, { token: 'my-token', tokenLocation: 'headers' })
    expect(context.init.headers.get('Authorization')).toBe('Bearer my-token')
  })

  it('should not prepend Bearer to the token if the tokenProperty is `Authorization`', () => {
    const context = { init: { headers: new Headers() } }
    parseRequestToken(context, { token: 'my-token', tokenLocation: 'headers', tokenProperty: 'Authorization' })
    expect(context.init.headers.get('Authorization')).toBe('my-token')
  })

  it('should append the token to the given headers', () => {
    const context = { init: { headers: new Headers() } }
    parseRequestToken(context, { token: 'my-token', tokenLocation: 'headers', tokenProperty: 'X-API-Token' })
    expect(context.init.headers.get('X-API-Token')).toBe('my-token')
  })

  it('should append the token to the cookies', () => {
    const context = { init: { headers: new Headers() } }
    parseRequestToken(context, { token: 'my-token', tokenLocation: 'cookie', tokenProperty: 'token' })
    expect(context.init.headers.get('Cookie')).toBe('token=my-token')
  })

  it('should return early if the token is not provided', () => {
    const context = { url: new URL('https://example.com') }
    parseRequestToken(context, { token: '', tokenLocation: 'query', tokenProperty: 'token' })
    expect(context.url.searchParams.get('token')).toBeNull()
  })

  it('should throw an error if the url is not an instance of URL when using query', () => {
    // @ts-expect-error: invalid context
    const shouldThrow = () => parseRequestToken({ url: 'https://example.com' }, { token: 'my-token', tokenLocation: 'query' })
    expect(shouldThrow).toThrow('The `url` must be an instance of `URL`.')
  })

  it('should throw an error if the tokenProperty is not provided for query', () => {
    const shouldThrow = () => parseRequestToken({ url: new URL('https://example.com') }, { token: 'my-token', tokenLocation: 'query' })
    expect(shouldThrow).toThrow('The `tokenProperty` must be provided when using `tokenLocation` of `query`.')
  })

  it('should throw an error if the tokenProperty is not provided for cookie', () => {
    const shouldThrow = () => parseRequestToken({ init: { headers: new Headers() } }, { token: 'my-token', tokenLocation: 'cookie' })
    expect(shouldThrow).toThrow('The `tokenProperty` must be provided when using `tokenLocation` of `cookie`.')
  })
})
