import { DgramSocket } from 'node-unix-socket'
import { Writable } from 'node:stream'

/**
 * Create a Writable stream that pipes log messages to the journald service
 * using the systemd-journal-socket. This is useful for logging in a systemd
 * environment where logs are centralized in the journal.
 *
 * **Note:** This function requires the `node-unix-socket` package to be installed.
 *
 * @param socketPath
 * The path to the systemd-journal-socket. If not provided, the default
 * path `/run/systemd/journal/socket` will be used.
 * @returns A Writable stream that emits log entries to the journald service.
 * @example
 * const journald = createJournaldStream();
 * journald.write("MESSAGE=Hello World\nTID=1234\n");
 */
export function createJournaldStream(socketPath = '/run/systemd/journal/socket') {
  const client = new DgramSocket()

  return new Writable({
    write(chunk: Buffer | string, encoding, callback) {
      const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
      client.sendTo(data, 0, data.length, socketPath, (error) => {
        if (error) {
          console.error('Could not send log message to journald socket:', error)
          callback(error)
        }
        else {
          callback()
        }
      })
    },
    final(callback) {
      client.close()
      callback()
    },
  })
}
