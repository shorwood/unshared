/* eslint-disable sonarjs/no-hardcoded-credentials */
import type { RequestContext } from './parseRequest'
import { parseRequestBasicAuth } from './parseRequestBasicAuth'

describe('parseRequestBasicAuth', () => {
  it('should set the Authorization header with encoded credentials', () => {
    const context = { init: {} } as RequestContext
    parseRequestBasicAuth(context, { username: 'user', password: 'pass' })
    expect(context.init.headers).toStrictEqual({ Authorization: 'Basic dXNlcjpwYXNz' })
  })

  it('should not set the Authorization header if username is missing', () => {
    const context = { init: {} } as RequestContext
    parseRequestBasicAuth(context, { password: 'pass' })
    expect(context.init.headers).toBeUndefined()
  })

  it('should not set the Authorization header if password is missing', () => {
    const context = { init: {} } as RequestContext
    parseRequestBasicAuth(context, { username: 'user' })
    expect(context.init.headers).toBeUndefined()
  })

  it('should not set the Authorization header if username and password are not strings', () => {
    const context = { init: {} } as RequestContext
    // @ts-expect-error: Testing invalid input.
    parseRequestBasicAuth(context, { username: 123, password: true })
    expect(context.init.headers).toBeUndefined()
  })

  it('should merge with existing headers', () => {
    const context = { init: { headers: { 'Content-Type': 'application/json' } } } as unknown as RequestContext
    parseRequestBasicAuth(context, { username: 'user', password: 'pass' })
    expect(context.init.headers).toStrictEqual({
      'Content-Type': 'application/json',
      'Authorization': 'Basic dXNlcjpwYXNz',
    })
  })
})
