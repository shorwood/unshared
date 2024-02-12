import { Http2ServerRequest, Http2ServerResponse } from 'node:http2'
import { CreateServerOptions, ServerRoutes } from './createServer'
import { HttpMethod } from './httpMethod'
import { isHttpMethod } from './isHttpMethod'

/**
 * The ID of a route as a combination of the HTTP method and the path.
 * This string will define the method and path of the route. The method
 * must be a valid HTTP method, and the path must be a valid path.
 *
 * @example 'GET /random'
 */
export type RouteName = `/${string}` | `${HttpMethod} /${string}`

/**
 * A function that can be used as a route handler. The `this` context is an object
 * containing the request, request, and `next` function. This allows the handler to
 * create a polymorphic function that can be used as handler as well as a plain
 * function.
 *
 * @template U The type of the return value.
 * @template P The type of the parameters.
 * @example RouteHandler<boolean, [number, string]> // (this: RequestContext, a: number, b: string) => boolean
 */
export type RouteHandler<U = unknown, P extends unknown[] = any[]> =
  (this: RequestContext | undefined, ...parameters: P) => U

/**
 * The context passed to a route handler. This object contains the request,
 * response, and `next` function. It also contains the routes and options
 * that were used to create the server.
 */
export interface RequestContext extends CreateServerOptions {
  /**
   * The routes that were used to create the server. This object can be used
   * to access the routes and their handlers.
   *
   * @example
   * const handler: RequestHandler = function() {
   *   const { routes } = this
   *   const { 'GET /random': random } = routes
   *   return random()
   * }
   */
  routes: ServerRoutes
  /**
   * The incoming request object. This object is the same as the request
   * object passed to the route handler and middleware. It can be used to
   * intercept and modify the request.
   *
   * @example
   * const handler: RequestHandler = function() {
   *   const { method, url } = this.request
   *   console.log(`Received ${method} request for ${url}`)
   * }
   */
  request: Http2ServerRequest
  /**
   * The outgoing response. This object is the same as the response object
   * passed to the route handler and middleware. It can be used to intercept
   * and modify the response.
   *
   * @example
   * const handler: RequestHandler = function() {
   *   this.response.setHeader('Content-Type', 'text/plain')
   *   this.response.end('Hello World')
   * }
   */
  response: Http2ServerResponse
  /**
   * Passes control to the next matching route. This function, if called,
   * will cause the current route handler to be skipped and the next matching
   * route to be handled.
   *
   * The result of this function will be sent to the client if no other
   * route handler is called.
   *
   * @example
   * const handler: RequestHandler = function() {
   *   // Check if the request should continue.
   *   if (this) {
   *     const shouldContinue = this.request.headers['x-continue'] === 'true'
   *     if (!shouldContinue) return this.next()
   *   }
   *
   *   // Send the response.
   *   return 'Hello World'
   * }
   */
  next: () => void
}

/**
 * The specification for an HTTP route.
 */
export interface Route {
  /**
   * The path at which to register the route. This path must start with a
   * slash and can contain parameters. To access the parameters, use the
   * `getRouteParameters` function.
   *
   * @example '/random/:min/:max'
   */
  path: string
  /**
   * The HTTP method that the route should handle. This method must be a
   * valid HTTP method. If no method is specified, the route will handle
   * all HTTP methods.
   *
   * @example 'GET'
   */
  method?: HttpMethod
  /**
   * The handlers that will be called when the route is matched. Each
   * handler will be called in the order that they are specified.
   *
   * The client will receive the result of the last handler that returned
   * a non-undefined value. If no handler returns a value, the client will
   * receive the result of the `next` function.
   *
   * @example
   * const handler: RequestHandler = function() {
   *   const { method, url } = this.request
   *   console.log(`Received ${method} request for ${url}`)
   * }
   */
  handlers: RouteHandler[]
}

/**
 * Create a route handler from a function.
 *
 * @param route The method and path of the route.
 * @param handlers The handler that will be called when the route is matched.
 * @returns The route.
 * @example createHttpRoute('GET /random', Math.random)
 */
export function createHttpRoute(route: RouteName, ...handlers: RouteHandler[]): Route {
  // --- Parse the route name.
  const routeParts = route.split(' ')
  if (routeParts.length === 1) routeParts.unshift('GET')
  const [method, path] = routeParts

  // --- Validate the route method and path.
  if (!isHttpMethod(method))
    throw new TypeError(`Expected method to be a valid HTTP method, got ${method}`)
  if (typeof path !== 'string')
    throw new TypeError('Expected path to be a string')
  if (path.startsWith('/') === false)
    throw new TypeError('Expected path to start with a slash')

  // --- Return the route.
  return { path, method, handlers }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a route with a GET method', () => {
    const route = createHttpRoute('/random', Math.random)
    expect(route).toStrictEqual({
      path: '/random',
      method: 'GET',
      handlers: [Math.random],
    })
  })

  it('should create a route with a POST method', () => {
    const route = createHttpRoute('POST /random', Math.random)
    expect(route).toStrictEqual({
      path: '/random',
      method: 'POST',
      handlers: [Math.random],
    })
  })

  it('should create a route with some middleware, but no handler', () => {
    const handler = () => {}
    const middleware = () => {}
    const route = createHttpRoute('/random', middleware, handler)
    expect(route).toStrictEqual({
      path: '/random',
      method: 'GET',
      handlers: [middleware, handler],
    })
  })

  it('should throw an error if the route name is not a string', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => createHttpRoute(123, Math.random)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the route name is not a valid HTTP method', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => createHttpRoute('INVALID /random', Math.random)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the route name is not a valid path', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => createHttpRoute('GET 123', Math.random)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the handler is not a function', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => createHttpRoute('GET /random', 123)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the middleware is not a function', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => createHttpRoute('GET /random', Math.random, 123)
    expect(shouldThrow).toThrow(TypeError)
  })
}
