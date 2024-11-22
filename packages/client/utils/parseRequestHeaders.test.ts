import type { RequestContext } from './parseRequest'
import { parseRequestHeaders } from './parseRequestHeaders'

describe('parseRequestHeaders', () => {
  it('should set headers from options', () => {
    const context = { init: {} } as RequestContext
    parseRequestHeaders('', { headers: { 'Content-Type': 'application/json' } }, context)
    expect(context.init.headers).toStrictEqual({ 'Content-Type': 'application/json' })
  })

  it('should merge headers with existing headers', () => {
    const context = { init: { headers: { Accept: 'application/json' } } }
    parseRequestHeaders('', { headers: { 'Content-Type': 'application/json' } }, context)
    expect(context.init.headers).toStrictEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })
  })

  it('should handle empty headers', () => {
    const context = { init: {} } as RequestContext
    parseRequestHeaders('', {}, context)
    expect(context.init.headers).toStrictEqual({})
  })

  it('should ignore undefined header values', () => {
    const context = { init: {} } as RequestContext
    parseRequestHeaders('', { headers: { 'Content-Type': undefined } }, context)
    expect(context.init.headers).toStrictEqual({})
  })

  it('should ignore non-string header values', () => {
    const context = { init: {} } as RequestContext
    // @ts-expect-error: intentionally passing a number
    parseRequestHeaders('', { headers: { 'Content-Type': 123 } }, context)
    expect(context.init.headers).toStrictEqual({})
  })
})
