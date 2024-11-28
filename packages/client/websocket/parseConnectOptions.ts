import type { Loose, ObjectLike, UnionMerge } from '@unshared/types'
import { parseRequestParameters } from '../utils/parseRequestParameters'
import { parseRequestQuery } from '../utils/parseRequestQuery'

/** Regular expression to match the request method and URL. */
const EXP_CONNECTION_CHANNEL = /^((?<protocol>[a-z]+) )?(?<url>[^:]+?:\/{2}[^/]+)?(?<path>\/[^\s?]*)/i

/** Valid WebSocket protocols. */
const PROTOCOLS = new Set(['ws', 'wss'])

/** The protocols to use for the connection. */
export type ConnectProtocol = 'WS' | 'WSS'

/** Options to pass to the `createChannel` function. */
export interface ConnectOptions<
  BaseUrl extends string = string,
  Query extends ObjectLike = ObjectLike,
  Parameters extends ObjectLike = ObjectLike,
  ClientData extends ObjectLike = any,
  ServerData extends ObjectLike = any,
> {

  /** The protocol to use when connecting to the server. */
  protocol?: Lowercase<ConnectProtocol> | Uppercase<ConnectProtocol>

  /** The base URL to connect to. */
  baseUrl?: BaseUrl

  /**
   * The path parameters to use when connecting to the server. These parameters will be used to
   * fill in the path parameters of the connection URL.
   *
   * @example { id: 1 }
   */
  parameters?: Parameters

  /**
   * The query parameters to use when connecting to the server. These parameters will be used to
   * fill in the query parameters of the connection URL.
   *
   * @example { limit: 10, offset: 0 }
   */
  query?: Loose<Query>

  /**
   * The data to send when creating the connection. Namely, the path parameters
   * to use when connecting to the server.
   *
   * @example
   *
   * // Create a new connection to `http://localhost:8080/users/1`.
   * connect('GET /users/:id', {
   *   data: { id: 1 },
   *   baseUrl: 'http://localhost:8080'
   * })
   */
  data?: UnionMerge<Loose<Query> | Parameters>

  /**
   * The payload to send when creating the connection. Namely, the initial message
   * to send to the server when the connection is established.
   */
  initialPayload?: Loose<ClientData>

  /**
   * Weather to reconnect the connection when it is closed unexpectedly. If `true`,
   * the connection will automatically reconnect when it is closed. If `false`, the
   * connection will not reconnect when it is closed.
   *
   * @default false
   */
  autoReconnect?: boolean

  /**
   * The delay in milliseconds to wait before reconnecting the connection. This delay
   * will be used to wait before reconnecting the connection after it is closed.
   *
   * @default 0
   */
  reconnectDelay?: number

  /**
   * The maximum number of times to reconnect the connection before giving up. This
   * number will be used to determine when to stop trying to reconnect the connection.
   *
   * @default 3
   */
  reconnectLimit?: number

  /**
   * The function to call when the connection is opened. This function will be called
   * when the connection is successfully opened or reconnected.
   */
  onOpen?: (event: Event) => void

  /**
   * The function to call when the connection is closed with an error. This function will
   * be called when the connection is closed unexpectedly with an error.
   */
  onError?: (event: Event) => void

  /**
   * The function to call when the connection is closed. This function will be called
   * when the connection is closed unexpectedly or when the connection is closed manually.
   */
  onClose?: (event: CloseEvent) => void

  /**
   * The function to call when a message is received from the server. This function will
   * be called when a message is received from the server.
   */
  onMessage?: (data: ServerData) => void
}

export interface WebSocketParameters {
  url: URL
  protocol?: 'ws' | 'wss'
}

function parseConnectUrl(parameters: WebSocketParameters, channel: string, options: ConnectOptions): void {
  const { baseUrl, protocol } = options

  // --- Extract the path, method, and base URL from the route name.
  const match = EXP_CONNECTION_CHANNEL.exec(channel)
  if (!match?.groups) throw new Error('Could not resolve the `RequestInit` object: Invalid route name.')
  const routeProtocol = protocol ?? match.groups.protocol ?? 'ws'
  const routeBaseUrl = baseUrl ?? match.groups.url

  // --- Assert the base URL is provided, either in the options or the route name.
  if (!routeBaseUrl) throw new Error('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')

  // --- Assert the method is valid.
  const protocolLower = routeProtocol.toLowerCase()
  const protocolIsValid = PROTOCOLS.has(protocolLower)
  if (!protocolIsValid) throw new Error(`Could not resolve the \`RequestInit\` object:, the method \`${routeProtocol}\` is invalid.`)

  // --- Create the url and apply the method.
  parameters.url = new URL(routeBaseUrl)
  parameters.url.pathname += parameters.url.pathname.endsWith('/') ? match.groups.path.slice(1) : match.groups.path
  parameters.protocol = protocolLower as 'ws' | 'wss'
}

export function parseConnectOptions(channel: string, options: ConnectOptions): WebSocketParameters {
  const { baseUrl, protocol, data, parameters = data, query = data } = options
  const context: WebSocketParameters = { url: new URL('about:blank') }
  parseConnectUrl(context, channel, { baseUrl, protocol })
  parseRequestParameters(context, { parameters })
  parseRequestQuery(context, { query })
  return context
}
