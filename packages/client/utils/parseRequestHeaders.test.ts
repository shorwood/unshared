import type { RequestContext } from './parseRequest'
import { parseRequestHeaders } from './parseRequestHeaders'

describe('parseRequestHeaders', () => {
  it('should set headers from options', () => {
    const context = {} as RequestContext
    parseRequestHeaders(context, { headers: { 'Content-Type': 'application/json' } })
    expect(context.init.headers).toStrictEqual({ 'Content-Type': 'application/json' })
  })

  it('should merge headers with existing headers', () => {
    const context = { init: { headers: { Accept: 'application/json' } } }
    parseRequestHeaders(context, { headers: { 'Content-Type': 'application/json' } } )
    expect(context.init.headers).toStrictEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })
  })

  it('should not set headers if no headers are provided', () => {
    const context = {} as RequestContext
    parseRequestHeaders(context, {})
    expect(context.init).toBeUndefined()
  })

  it('should cast number values to strings', () => {
    const context = {} as RequestContext
    parseRequestHeaders(context, { headers: { 'Content-Length': 123 } })
    expect(context.init.headers).toStrictEqual({ 'Content-Length': '123' })
  })

  it('should ignore undefined header values', () => {
    const context = {} as RequestContext
    parseRequestHeaders(context, { headers: { 'Content-Type': undefined } })
    expect(context.init).toBeUndefined()
  })

  it('should ignore non-string header values', () => {
    const context = {} as RequestContext
    // @ts-expect-error: intentionally passing a number
    parseRequestHeaders('', { headers: { 'Content-Type': { value: 123 } } }, context)
    expect(context.init).toBeUndefined()
  })
})
