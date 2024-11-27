import type { Result } from '@unshared/functions/attempt'
import type { Fallback, ObjectLike } from '@unshared/types'
import type { ServiceOptions } from './createService'
import type { OpenAPILike, OpenAPIOptionsMap } from './openapi'
import type { RequestOptions } from './utils'
import type { ConnectOptions, WebSocketChannel } from './websocket'
import { attempt } from '@unshared/functions/attempt'
import { fetch } from './utils/fetch'
import { request } from './utils/request'
import { connect } from './websocket/connect'

/** Define the routes that can be fetched from the API and their related options. */
type OptionsMap = Record<string, ConnectOptions | RequestOptions>

/** The route name that can be fetched from the API. */
type RouteName<T extends OptionsMap> =
  Fallback<{ [P in keyof T]: T[P] extends RequestOptions ? P : never }[keyof T] & string, string>

/** The options to pass to the request based on the route name. */
type RouteOptions<T extends OptionsMap, P extends keyof T> =
  { [K in keyof T]: T[K] extends RequestOptions ? T[K] : RequestOptions }[P]

/** The channel name that can be connected to using WebSockets. */
type ChannelName<T extends OptionsMap> =
  Fallback<{ [P in keyof T]: T[P] extends ConnectOptions ? P : never }[keyof T] & string, string>

/** The options to pass to the WebSocket connection based on the route name. */
type ChannelOptions<T extends OptionsMap, P extends keyof T> =
  { [K in keyof T]: T[K] extends ConnectOptions ? T[K] : ConnectOptions }[P]

/** The data returned from the API based on the route name. */
type Data<T extends OptionsMap, P extends keyof T> =
  RouteOptions<T, P> extends RequestOptions<any, any, any, any, any, any, infer R extends ObjectLike, any>
    ? R : unknown

export class Client<T extends OptionsMap = any> {

  /**
   * Create a new client for the application.
   *
   * @param options The options to pass to the client.
   * @example new Client({ baseUrl: 'https://api.example.com' })
   */
  constructor(public options: RequestOptions = {}) {}

  /**
   * Fetch a route from the API and return the `Response` object. If the client was instantiated with an
   * application, the route name will be inferred from the application routes. Otherwise, you
   * can pass the route name as a string.
   *
   * @param route The name of the route to fetch.
   * @param options The options to pass to the request.
   * @returns The response from the server.
   */
  public async fetch<P extends RouteName<T>>(route: P, options?: RouteOptions<T, P>): Promise<Response> {
    return await fetch(route, { ...this.options, ...options })
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
  public async request<P extends RouteName<T>>(route: P, options?: RouteOptions<T, P>): Promise<Data<T, P>> {
    return await request(route, { ...this.options, ...options }) as Data<T, P>
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
  public async requestAttempt<P extends RouteName<T>>(name: P, options?: RouteOptions<T, P>): Promise<Result<Data<T, P>>> {
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
  public connect<P extends ChannelName<T>>(name: P, options?: ChannelOptions<T, P>): WebSocketChannel<ChannelOptions<T, P>> {
    return connect(name, { baseUrl: this.options.baseUrl, ...options }) as WebSocketChannel<ChannelOptions<T, P>>
  }
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
export function createClient<T extends OpenAPILike>(options?: ServiceOptions<T>): Client<OpenAPIOptionsMap<T>>
export function createClient<T extends OptionsMap>(options?: RequestOptions): Client<T>
export function createClient(options?: RequestOptions): Client {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return new Client(options)
}
