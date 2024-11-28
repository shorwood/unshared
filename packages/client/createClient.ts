import type { Awaitable } from '@unshared/functions'
import type { Result } from '@unshared/functions/attempt'
import type { ServiceOptions } from './createService'
import type { OpenAPILike, OpenAPIOptionsMap } from './openapi'
import type { RequestOptions } from './utils'
import type { ConnectOptions, WebSocketChannel } from './websocket'
import { attempt } from '@unshared/functions/attempt'
import { fetch } from './utils/fetch'
import { request } from './utils/request'
import { connect } from './websocket/connect'

type Data<T extends RequestOptions> = T extends RequestOptions<any, any, any, any, any, any, infer R, any> ? R : unknown
type Routes = Record<string, RequestOptions>
type Channels = Record<string, ConnectOptions>

export class Client<T extends Routes = Routes, U extends Channels = Channels> {

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
  public fetch<K extends keyof T & string, V extends T[K]>(route: K, options?: V): Promise<Response> {
    return fetch(route, { ...this.options, ...options })
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
  public request<K extends keyof T & string, V extends T[K]>(route: K, options?: V): Promise<Data<V>> {
    return request(route, { ...this.options, ...options }) as Promise<Data<V>>
  }

  /**
   * Attempt to fetch a route from the API and return the data. If the client was instantiated with an
   * application, the route name will be inferred from the application routes. Otherwise, you
   * can pass the route name as a string.
   *
   * @param route The name of the route to fetch.
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
  public requestAttempt<K extends keyof T & string, V extends T[K]>(route: K, options?: V): Promise<Result<Data<V>>> {
    return attempt(() => this.request(route, options))
  }

  /**
   * Create a new WebSocket connection to the server with the given path. The connection will
   * automatically reconnect if the connection is closed unexpectedly.
   *
   * @param channel The path to connect to.
   * @param options The options to pass to the connection.
   * @returns The WebSocket connection.
   */
  public connect<P extends keyof U & string, V extends U[P]>(channel: P, options?: V): Awaitable<WebSocketChannel<V>, WebSocketChannel<V>> {
    return connect(channel, { baseUrl: this.options.baseUrl, ...options }) as Awaitable<WebSocketChannel<V>, WebSocketChannel<V>>
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
export function createClient<T extends Routes = Routes, V extends Channels = Channels>(options?: RequestOptions): Client<T, V>
export function createClient(options?: RequestOptions): Client {
  return new Client(options)
}
