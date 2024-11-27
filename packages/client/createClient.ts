import type { Result } from '@unshared/functions/attempt'
import type { ObjectLike } from '@unshared/types'
import type { ServiceOptions } from './createService'
import type { OpenAPIRoutes } from './openapi'
import type { RequestOptions } from './utils/request'
import { attempt } from '@unshared/functions/attempt'
import { fetch } from './utils/fetch'
import { request } from './utils/request'

/** Define the routes that can be fetched from the API and their related options. */
export type ClientRoutes = Record<string, RequestOptions>

/** The route name that can be fetched from the API. */
type Route<T extends ClientRoutes> =
  T extends Record<infer P extends string, RequestOptions> ? P : string

/** The options to pass to the request based on the route name. */
type Options<T extends ClientRoutes, P extends keyof T> =
  T extends Record<P, infer R> ? R : RequestOptions

/** The data returned from the API based on the route name. */
type Data<T extends ClientRoutes, P extends keyof T> =
  Options<T, P> extends RequestOptions<any, any, any, any, any, any, infer R extends ObjectLike, any>
    ? R
    : unknown

export class Client<T extends ClientRoutes = ClientRoutes> {

  /**
   * Create a new client for the application.
   *
   * @param initialOptions The options to pass to the client.
   * @example new Client({ baseUrl: 'https://api.example.com' })
   */
  constructor(private initialOptions: RequestOptions = {}) {}

  /**
   * Fetch a route from the API and return the `Response` object. If the client was instantiated with an
   * application, the route name will be inferred from the application routes. Otherwise, you
   * can pass the route name as a string.
   *
   * @param route The name of the route to fetch.
   * @param options The options to pass to the request.
   * @returns The response from the server.
   */
  public async fetch<P extends Route<T>>(route: P, options?: Options<T, P>): Promise<Response> {
    return await fetch(route, { ...this.initialOptions, ...options })
  }

  /**
   * Fetch a route from the API and return the data. If the client was instantiated with an
   * application, the route name will be inferred from the application routes. Otherwise, you
   * can pass the route name as a string.
   *
   * @param route The name of the route to fetch.
   * @param options The options to pass to the request.
   * @returns The data from the API.
   * @example
   * // Declare the application type.
   * type App = Application<[ModuleProduct]>
   *
   * // Create a type-safe client for the application.
   * const request = createClient<App>()
   *
   * // Fetch the data from the API.
   * const data = request('GET /api/product/:id', { data: { id: '1' } })
   */
  public async request<P extends Route<T>>(route: P, options?: Options<T, P>): Promise<Data<T, P>> {
    return await request(route, { ...this.initialOptions, ...options }) as Data<T, P>
  }

  /**
   * Attempt to fetch a route from the API and return the data. If the client was instantiated with an
   * application, the route name will be inferred from the application routes. Otherwise, you
   * can pass the route name as a string.
   *
   * @param name The name of the route to fetch.
   * @param options The options to pass to the request.
   * @returns A result object with either the data or an error.
   * @example
   * // Declare the application type.
   * type App = Application<[ModuleProduct]>
   *
   * // Create a type-safe client for the application.
   * const request = createClient<App>()
   *
   * // Fetch the data from the API.
   * const { data, error } = requestAttempt('GET /api/product/:id', { data: { id: '1' } })
   * if (error) console.error(error)
   * else console.log(data)
   */
  public async requestAttempt<P extends Route<T>>(name: P, options?: Options<T, P>): Promise<Result<Data<T, P>>> {
    return await attempt(() => this.request<P>(name, options))
  }

  /**
   * Create a new WebSocket connection to the server with the given path. The connection will
   * automatically reconnect if the connection is closed unexpectedly.
   *
   * @param name The path to connect to.
   * @param options The options to pass to the connection.
   * @returns The WebSocket connection.
   */
  // public connect<P extends RouteName<T>>(name: P, options: Partial<ConnectOptions<T, P>> = {}): WebSocketConnection<T, P> {
  //   return connect<T, P>(name, { baseUrl: this.baseUrl, ...options })
  // }
}

/**
 * Create a new type-safe client for the application. The client can be used to fetch data from
 * the API and connect to the server using WebSockets with the given path.
 *
 * @param options The options to pass to the client.
 * @returns The client object with the request method.
 * @example
 * // Create a type-safe client for the application.
 * const client = createClient<[ModuleUser]>()
 *
 * // Fetch the data from the API.
 * const data = await client.request('GET /api/user/:id', { id: '1' })
 *
 * // Use the data from the API.
 * console.log(data) // { id: '1', name: 'John Doe' }
 */
export function createClient<T extends ClientRoutes>(options?: RequestOptions): Client<T>
export function createClient<T extends { swagger: string }>(options?: ServiceOptions<T>): Client<OpenAPIRoutes<T>>
export function createClient<T extends { openapi: string }>(options?: ServiceOptions<T>): Client<OpenAPIRoutes<T>>
export function createClient(options?: RequestOptions): Client {
  return new Client(options)
}
