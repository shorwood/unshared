import { ClientHttp2Session, connect } from 'node:http2'
import { type } from 'node:os'

export interface RequestInfo2 extends RequestInfo {}

const sessions = new Map<string, ClientHttp2Session>()

/**
 * Request an HTTP/2 server. This function is has the same API as `fetch`, but it
 * uses HTTP/2 instead of HTTP/1.1.
 *
 * @param url The URL to request.
 * @param options The options.
 * @returns The response.
 * @example
 * const response = await fetch2('https://example.com')
 * const body = await response.text() // 'Hello, world!'
 */
export async function fetch2(url: Request | URL | string, options: InitOptions = {}): Promise<Response> {
  let authority: string | undefined
  if (typeof url === 'string') authority = url
  else if (url instanceof URL) authority = url.origin
  else if (url instanceof Request) authority = url.url

  if (!authority)
    throw new TypeError('Invalid URL')

  const session = connect(authority, (session, socket) => {
    console.log('session', session)
    console.log('socket', socket)
  })

  session.on('connect', () => {
    console.log('connect')
  })
}
