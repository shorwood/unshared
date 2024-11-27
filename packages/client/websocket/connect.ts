import type { ObjectLike } from '@unshared/types'
import type { ConnectOptions } from './parseConnectOptions'
import { parseConnectOptions } from './parseConnectOptions'

type RemoveListener = () => void

type Payload<T extends ConnectOptions> =
  T extends ConnectOptions<any, any, any, infer R extends ObjectLike, any> ? R : ObjectLike

type Message<T extends ConnectOptions> =
  T extends ConnectOptions<any, any, any, any, infer R extends ObjectLike> ? R : ObjectLike

export class WebSocketChannel<T extends ConnectOptions = ConnectOptions> {
  constructor(public channel: string, public options: T) {}

  /** The WebSocket connection to the server. */
  public webSocket: WebSocket | undefined

  /**
   * Open a new WebSocket connection to the server. The connection will be opened with the given
   * URL and protocols. If the connection is already open, the connection will be closed before
   * opening a new connection. Also add the event listeners that were passed in the options.
   */
  async open() {
    if (this.webSocket) await this.close()
    const { url, protocol } = parseConnectOptions(this.channel, this.options)
    this.webSocket = new WebSocket(url, protocol)
    if (this.options.onOpen) this.on('open', this.options.onOpen)
    if (this.options.onClose) this.on('close', this.options.onClose)
    if (this.options.onError) this.on('error', this.options.onError)
    if (this.options.onMessage) this.on('message', message => this.options.onMessage!(message))

    // --- Reconnect to the server if the connection is closed unexpectedly.
    this.webSocket.addEventListener('close', (event) => {
      if (event.code === 1000) return
      if (!this.options.autoReconnect) return
      if (this.options.reconnectLimit && event.wasClean) return
      setTimeout(() => void this.open(), this.options.reconnectDelay ?? 0)
    })

    // --- Return a promise that resolves when the connection is opened.
    return new Promise<void>((resolve, rejects) => {
      this.webSocket!.addEventListener('open', () => resolve())
      this.webSocket!.addEventListener('error', () => rejects(new Error('Failed to open the WebSocket connection')))
    })
  }

  /**
   * Send a payload to the server. The payload will be serialized to JSON before sending.
   *
   * @param payload The data to send to the server.
   */
  send(payload: Payload<T>) {
    if (!this.webSocket) throw new Error('WebSocket connection is not open')
    const json = JSON.stringify(payload)
    this.webSocket.send(json)
  }

  /**
   * Listen for events from the server. The event will be deserialized from JSON before calling the callback.
   *
   * @param event The event to listen for.
   * @param callback The callback to call when the event is received.
   * @returns A function to remove the event listener.
   */
  on(event: 'message', callback: (payload: Message<T>) => void): RemoveListener
  on(event: 'close', callback: (event: CloseEvent) => void): RemoveListener
  on(event: 'error', callback: (event: Event) => void): RemoveListener
  on(event: 'open', callback: (event: Event) => void): RemoveListener
  on(event: string, callback: (payload: any) => void) {
    if (!this.webSocket) throw new Error('WebSocket connection has not been opened yet')

    const listener = (event: CloseEvent | Event | MessageEvent<any>) => {
      // @ts-expect-error: `data` exists on the event.
      let payload = event.data as unknown
      try { payload = JSON.parse(payload as string) }
      catch { /* Ignore the error. */ }
      callback(payload as T)
    }

    this.webSocket.addEventListener(event, listener)
    return () => this.webSocket!.removeEventListener(event, listener)
  }

  /**
   * Close the WebSocket connection to the server. The connection will not be able to send or receive
   * messages after it is closed.
   */
  async close() {
    if (!this.webSocket) throw new Error('WebSocket connection has not been opened yet')
    if (this.webSocket.readyState === WebSocket.CLOSED) return
    if (this.webSocket.readyState === WebSocket.CLOSING) return
    this.webSocket.close(1000, 'Client closed the connection')
    await new Promise<void>(resolve => this.webSocket!.addEventListener('close', () => resolve()))
  }
}

/** Define the routes that can be fetched from the API and their related options. */
export type ChannelOptionsMap = Record<string, ConnectOptions>

/**
 * Create a new WebSocket connection to the server with the given path. The connection will
 * automatically reconnect if the connection is closed unexpectedly.
 *
 * @param route The name of the route to connect to.
 * @param options The options to pass to the connection.
 * @returns The WebSocket connection.
 */
export function connect(route: string, options: ConnectOptions): WebSocketChannel {
  return new WebSocketChannel(route, options)
}
