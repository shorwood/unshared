import { Server as HttpServer, createServer as createHttpServer } from 'node:http'
import { createSecureServer as createHttp2SecureServer, createServer as createHttp2Server } from 'node:http2'
import { Server as HttpsServer, createServer as createHttpsServer } from 'node:https'
import { AddressInfo, Server } from 'node:net'

/**
 * Get the URL of a NodeJS `Server` instance. The protocol is inferred by the instance
 * type while the host and port are inferred from the `address()` method. If the server
 * is not listening an error will be thrown.
 *
 * @param server The server instance to get the URL of.
 * @returns The URL of the server.
 * @example getServerAddress(server) // 'http://0.0.0.0:8080' or '/tmp/server.sock'
 */
export function getServerAddress(server: Server): string {
  if (server instanceof Server === false)
    throw new TypeError('Cannot get the address of the server: Expected a Server instance.')
  if (!server.listening)
    throw new Error('Cannot get the address of the server: Server is not listening.')

  // --- Get the address and port.
  const address = server.address()
  if (typeof address === 'string') return address
  const { address: host, port } = address!

  // --- Get the protocol.
  let protocol = ''
  if (server instanceof HttpServer) protocol = 'http://'
  if (server instanceof HttpsServer) protocol = 'https://'
  if (server.constructor.name === 'Http2Server') protocol = 'http://'
  if (server.constructor.name === 'Http2SecureServer') protocol = 'https://'
  if (server.constructor.name === 'WebSocketServer') protocol = 'ws://'

  // --- Return the URL.
  return `${protocol}${host}:${port}`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the URL of an HTTP server', () => {
    const server = createHttpServer()
    server.listen(0)
    const url = getServerAddress(server)
    expect(url).toMatch(/^http:\/\/0\.0\.0\.0:\d+$/)
    server.close()
  })

  it('should get the URL of an HTTPS server', () => {
    const server = createHttpsServer()
    server.listen(0)
    const url = getServerAddress(server)
    expect(url).toMatch(/^https:\/\/0\.0\.0\.0:\d+$/)
    server.close()
  })

  it('should get the URL of an HTTP/2 server', () => {
    const server = createHttp2Server()
    server.listen(0)
    const url = getServerAddress(server)
    expect(url).toMatch(/^http:\/\/0\.0\.0\.0:\d+$/)
    server.close()
  })

  it('should get the URL of an HTTP/2 secure server', () => {
    const server = createHttp2SecureServer()
    server.listen(0)
    const url = getServerAddress(server)
    expect(url).toMatch(/^https:\/\/0\.0\.0\.0:\d+$/)
    server.close()
  })

  it('should get the path of a UNIX socket server', () => {
    const server = createHttpServer()
    server.listen('/tmp/test.sock')
    const url = getServerAddress(server)
    expect(url).toBe('/tmp/test.sock')
    server.close()
  })

  it('should get the path of a Windows named pipe server', () => {
    const server = createHttpServer()
    server.listen('\\\\.\\pipe\\test.sock')
    const url = getServerAddress(server)
    expect(url).toBe('\\\\.\\pipe\\test.sock')
    server.close()
  })

  it('should throw an error if the server is not listening', () => {
    const server = createHttpServer()
    const shouldThrow = () => getServerAddress(server)
    expect(shouldThrow).toThrowError('Server is not listening.')
  })

  it('should throw an error if the server is not a Server instance', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => getServerAddress({})
    expect(shouldThrow).toThrowError('Expected a Server instance.')
  })
}
