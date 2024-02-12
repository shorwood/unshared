import { Socket, createSocket } from 'node:dgram'
import { createConnection, isIPv4 } from 'node:net'
import { Writable } from 'node:stream'

export interface SyslogStreamOptions {
  /**
   * The port to connect to the Syslog server on.
   *
   * @default 514
   */
  port?: number
  /**
   * The host to connect to the Syslog server on.
   *
   * @default "127.0.0.1"
   */
  host?: string
  /**
   * The protocol to use for the Syslog connection.
   *
   * @default "tcp"
   */
  protocol?: 'tcp' | 'udp'
}

/**
 * Create a Writable stream that connects to a Syslog server.
 *
 * @param options The options to use when creating the stream.
 * @returns A Writable stream that emits log entries to the Syslog server.
 * @example
 * const syslog = await createSyslogStream();
 * syslog.write("10<134>1 - - - - - Hello World");
 */
export const createSyslogStream = async(options: SyslogStreamOptions = {}) => {
  const { port = 514, host = '127.0.0.1', protocol = 'tcp' } = options

  // --- Create and return Syslog TCP stream/socket.
  if (protocol === 'tcp') {
    return await new Promise<Writable>((resolve, reject) => {
      const syslogSocket = createConnection(port, host)
      syslogSocket.on('connect', () => resolve(syslogSocket))
        .on('error', reject)
        .unref()
    })
  }

  // --- Create Syslog Dgram UDP socket.
  const syslogSocket = await new Promise<Socket>((resolve, reject) => {
    const udpProtocol = isIPv4(host) ? 'udp4' : 'udp6'
    const syslogSocket = createSocket(udpProtocol)
    syslogSocket.bind(port, host)
      .on('listening', () => resolve(syslogSocket))
      .on('error', reject)
      .unref()
  })

  // --- Return a passthrough stream to Syslog UDP socket.
  return new Writable({
    write(chunk, encoding, callback, error) {
      if (error) return callback(error)
      const message = encoding ? Buffer.from(chunk, encoding) : chunk
      syslogSocket.emit('message', message)
      callback()
    },
    destroy(error, callback) {
      syslogSocket.close()
      callback(error)
    },
  })
}
