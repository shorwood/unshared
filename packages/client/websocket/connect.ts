import type { ConnectOptions } from './parseConnectOptions'
import { parseConnectOptions } from './parseConnectOptions'

type RemoveListener = () => void

type ClientData<T extends ConnectOptions> =
  T extends ConnectOptions<any, any, any, infer R, any> ? R : any

type ServerData<T extends ConnectOptions> =
  T extends ConnectOptions<any, any, any, any, infer R> ? R : any

export class WebSocketChannel<T extends ConnectOptions = ConnectOptions> {
  constructor(public channel: string, public options: T) {}

  /** The WebSocket connection to the server. */
  public webSocket: undefined | WebSocket

  /**
   * Open a new WebSocket connection to the server. The connection will be opened with the given
   * URL and protocols. If the connection is already open, the connection will be closed before
   * opening a new connection. Also add the event listeners that were passed in the options.
   */
  async open() {
    if (this.webSocket) await this.close()
    const { url, protocol } = parseConnectOptions(this.channel, this.options)
    this.webSocket = new WebSocket(url, protocol)
    if (this.options.onOpen) this.on('open', this.options.onOpen, { once: true })
    if (this.options.onClose) this.on('close', this.options.onClose, { once: true })
    if (this.options.onError) this.on('error', this.options.onError)
    if (this.options.onMessage) this.on('message', message => this.options.onMessage!(message))

    // --- Reconnect to the server if the connection is closed unexpectedly.
    this.webSocket.addEventListener('close', (event) => {
      if (event.code === 1000) return
      if (!this.options.autoReconnect) return
      if (this.options.reconnectLimit && event.wasClean) return
      setTimeout(() => void this.open(), this.options.reconnectDelay ?? 0)
    }, { once: true })

    // --- Return a promise that resolves when the connection is opened.
    return new Promise<void>((resolve, rejects) => {
      this.webSocket!.addEventListener('open', () => resolve(), { once: true })
      this.webSocket!.addEventListener('error', () => rejects(new Error('Failed to open the WebSocket connection')), { once: true })
    })
  }

  /**
   * Send a payload to the server. The payload will be serialized to JSON before sending.
   *
   * @param payload The data to send to the server.
   */
  send(payload: ClientData<T>) {
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
  on(event: 'message', callback: (data: ServerData<T>) => void, options?: AddEventListenerOptions): RemoveListener
  on(event: 'close', callback: (event: CloseEvent) => void, options?: AddEventListenerOptions): RemoveListener
  on(event: 'error', callback: (event: Event) => void, options?: AddEventListenerOptions): RemoveListener
  on(event: 'open', callback: (event: Event) => void, options?: AddEventListenerOptions): RemoveListener
  on(event: string, callback: (data: any) => void, options?: AddEventListenerOptions) {
    if (!this.webSocket) throw new Error('WebSocket connection has not been opened yet')

    const listener = async(event: CloseEvent | Event | MessageEvent<Blob>): Promise<void> => {
      if (event.type !== 'message') return callback(event)
      // @ts-expect-error: `data` exists on the event.
      let data = event.data as unknown
      if (data instanceof Blob) data = await data.text()
      try { data = JSON.parse(data as string) }
      catch { console.error('Failed to parse the message:', data) }
      callback(data)
    }

    /* eslint-disable @typescript-eslint/no-misused-promises */
    this.webSocket.addEventListener(event, listener, options)
    return () => this.webSocket!.removeEventListener(event, listener)
    /* eslint-enable @typescript-eslint/no-misused-promises */
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
