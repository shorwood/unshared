/* eslint-disable unicorn/prefer-switch */
import { rejects } from 'node:assert'
import {
  Http2Server,
  Http2ServerRequest,
  Http2ServerResponse,
  SecureServerOptions,
  ServerOptions,
  connect,
  constants,
  createServer as createHttpServer,
  createSecureServer as createHttpsServer,
} from 'node:http2'
import { Agent } from 'node:https'
import { MaybeArray } from '@unshared/types/MaybeArray'
import { RouteHandler, RouteName } from './createServerRoute'
import { getServerAddress } from './getServerAddress'
import { handleHttpRequest } from './utils'

export interface CreateServerOptions extends ServerOptions, SecureServerOptions {
  /**
   * If the server should use secure connections. If this is `true`, the server
   * will enforce [HTTP/2 over TLS](https://tools.ietf.org/html/rfc7540#section-9.2).
   * Internally, this will initialize the server with `createSecureServer()` instead
   * of `createServer()`.
   *
   * @default true
   */
  secure?: boolean
}

/**
 * A map of routes to create the server from. The key is the route name, and the
 * value is the route handler. If the route has middleware, the value should be
 * an array where the first element is the handler and the rest are the middleware.
 *
 * @example
 * const randomNormalized = (this: RequestContext, min: number = this.request.params.min, max: number = this.request.params.max) => {
 *   const number = Math.random() * (max - min) + min
 *   return number
 * }
 *
 * const routes = {
 *   'GET /random': Math.random,
 *   'GET /random/:min/:max': randomNormalized,
 * }
 *
 * const server = createServer(routes)
 * server.listen(8080)
 */
export type ServerRoutes = Record<RouteName, MaybeArray<RouteHandler>>

/**
 * Creates an instance of an HTTP/2 server. The server will listen for requests
 * and call the appropriate handler when a request is received.
 *
 * @param routes The routes to create the server from.
 * @param options The options.
 * @returns The server.
 */
export function createServer(routes: ServerRoutes, options: CreateServerOptions = {}): Http2Server {
  const handler = (request: Http2ServerRequest, response: Http2ServerResponse) => {
    console.log('request', request.url)

    response.writeHead(200, { 'content-type': 'text/plain' })
    response.end()

    // response.writeHead(200, { 'content-type': 'text/plain' })
    // handleHttpRequest({ request, response, routes })
  }

  // --- Create the server.
  return options.secure === false
    ? createHttpServer(options, handler)
    : createHttpsServer(options, handler)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create an HTTP server', () => {
    const result = createServer({}, { secure: false })
    const constructorName = result.constructor.name
    expect(constructorName).toEqual('Http2Server')
  })

  it('should create an HTTPS server', () => {
    const result = createServer({}, { secure: true })
    const constructorName = result.constructor.name
    expect(constructorName).toEqual('Http2SecureServer')
  })

  it('should create an HTTP with a GET route', async() => {
    const routes = { 'GET /': () => 'Hello, world!' }
    const server = createServer(routes, { secure: false, allowHTTP1: true }).listen(0)
    const serverUrl = getServerAddress(server)

    const session = connect(serverUrl)
    const request = session.request({
      [constants.HTTP2_HEADER_PATH]: '/',
      [constants.HTTP2_HEADER_METHOD]: 'GET',
    })

    const response = await new Promise<Http2ServerRequest>((resolve) => {
      const response = {
        headers: {},
        body: '',
      }
      request.on('response', (headers) => { response.headers = headers })
      request.on('data', (chunk) => { response.body += chunk })
      request.on('error', rejects)
      request.on('end', response)
    })

    console.log('response', response)

    expect(text).toEqual('Hello, world!')
  })
}
