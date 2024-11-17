import { createServer } from 'node:net'

export interface CreateProxyOptions {

  /**
   * The server to transfer the payload to. If this is not provided,
   * the server will not transfer the payload.
   */
  target?: URL | string
}

/**
 * Create a server that listens for any kind of payload and
 * transfers it to another server. This proxy server can then
 * be used to inspect, modify, or block the payload.
 *
 * @param options The proxy options.
 */
export function createProxy(options: CreateProxyOptions = {}): Http2Server {
  const server = createServer((socket) => {

    socket.on('data', (data) => {
      console.log('data', data)
    })

    socket.on('end', () => {
      console.log('end')
    })

    socket.on('close', () => {
      console.log('close')
    })

    socket.on('connect', () => {
      console.log('connect')
    })

    socket.on('error', (error) => {
      console.log('error', error)
    })

    socket.on('lookup', (error, address, family, host) => {
      console.log('lookup', error, address, family, host)
    })

    console.log('socket', socket)
  })
}
