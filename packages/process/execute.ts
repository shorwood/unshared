import type { BinaryLike } from '@unshared/binary/toUint8Array'
import type { Awaitable } from '@unshared/functions/awaitable'
import type { Function } from '@unshared/types'
import type { ChildProcess, SpawnOptions } from 'node:child_process'
import type { Server } from 'node:net'
import type { Writable } from 'node:stream'
import { toUint8Array } from '@unshared/binary/toUint8Array'
import { awaitable } from '@unshared/functions/awaitable'
import { createResolvable } from '@unshared/functions/createResolvable'
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { createServer } from 'node:net'
import { platform } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'

/** Argument that can be passed to `execute`. */
export type BinaryArgument = BinaryLike | Function<BinaryLike | Readable> | Readable

export interface ExecuteOptions<T extends BufferEncoding | undefined = BufferEncoding | undefined> extends SpawnOptions {

  /**
   * The encoding to use for the output.
   *
   * @example await execute("echo", ["Hello, world!"], { encoding: "base64" }) // "SGVsbG8sIHdvcmxkIQ=="
   */
  encoding?: T

  /**
   * The input to pipe to the process. If provided, the process will write this
   * value to `stdin` and then close it.
   *
   * @example await execute("echo", [], { stdin: "Hello, world!" }) // "Hello, world!"
   */
  stdin?: BinaryArgument

  /**
   * The timeout to use for the process.
   *
   * @default 0
   * @example await execute("sleep", ["10"], { timeout: 1000 }) // Error: Process timed out.
   */
  timeout?: number
}

/**
 * Helper function to write data to a stream.
 *
 * @param stream The stream to write to.
 * @param data A buffer or stream to write to the stream.
 *
 * @example writeToStream(stream, Buffer.from("Hello, world!"))
 */
function writeToStream(stream: Writable, data: BinaryArgument) {
  if (typeof data === 'function') data = data()
  if (data instanceof Readable) { data.pipe(stream); return }
  data = toUint8Array(data)
  stream.write(data)
  stream.end()
}

/**
 * Helper function to get the path of the socket. On Unix systems, this will
 * return the path of the socket. On Windows systems, this will return the
 * path of the named pipe.
 *
 * @returns The path of the socket or named pipe.
 */
function getSocketPath() {
  const os = platform()
  const id = randomBytes(4).toString('hex')

  // --- On Windows, use named pipes.
  if (os === 'win32') return `\\\\.\\pipe\\node-${id}.sock`

  // --- On Unix, use sockets.
  const uid = process.getuid ? process.getuid().toString() : '0'
  const uuid = randomBytes(4).toString('hex')
  return join('/run/user', uid, `node-${uuid}.sock`)
}

/**
 * Spawn a process and return the output. This function is similar to `child_process.spawn` but it
 * returns a promise that resolves with the `stdout` output of the process and throws an error if
 * the process exits with a non-zero exit code. It also supports piping from `stdin`.
 *
 * One key feature of this function is that it supports passing `Buffer` instances to arguments
 * expecting a file path. This is done by passing the buffer to `<(echo ${buffer})` which will
 * write the buffer to a temporary file descriptor and then pass the path to the file descriptor
 * to the process. This is useful for passing buffers to commands such as `diff` or `openssl`.
 *
 * @param command The command to call.
 * @param parameters The arguments to pass to the command.
 * @param options The encoding to use for the output or the options to use for the process.
 * @returns The output of the process.
 * @example
 * const a = Buffer.from("Hello, world!")
 * const b = Buffer.from("Hello, world?")
 * await execute("diff", [a, b]) // The diff output.
 */
export function execute(command: string, parameters: BinaryArgument[] | undefined, options: ExecuteOptions<undefined>): Awaitable<ChildProcess, Buffer>
export function execute(command: string, parameters: BinaryArgument[] | undefined, options: ExecuteOptions<BufferEncoding>): Awaitable<ChildProcess, string>
export function execute(command: string, parameters: BinaryArgument[] | undefined, encoding: BufferEncoding): Awaitable<ChildProcess, string>
export function execute(command: string, parameters?: BinaryArgument[]): Awaitable<ChildProcess, Buffer>
export function execute(command: string, parameters: BinaryArgument[] = [], options: BufferEncoding | ExecuteOptions = {}): Awaitable<ChildProcess, Buffer | string> {
  if (typeof options === 'string') options = { encoding: options }
  const { encoding, stdin, shell, ...spawnOptions } = options
  const resolvable = createResolvable<Buffer | string>()

  // --- If the argument is some kind of binary data, we need to create
  // --- a temporary socket to pass the data to the process. This is done
  // --- by writing the data to the socket and then reading from it using
  // --- process substitution through the `nc` command.
  const sockets: Server[] = []
  const spawnParameters = parameters.map((parameter) => {
    if (typeof parameter === 'string') return parameter
    const path = getSocketPath()
    const server = createServer()
    server.maxConnections = 1
    server.listen(path)
    server.once('error', (error) => {
      server.close()
      error.message = `Could not create socket at ${path}: ${error.message}`
      resolvable.reject(error)
    })
    server.once('connection', socket => writeToStream(socket, parameter))
    sockets.push(server)
    return `<(echo | nc -U ${path})`
  })

  // --- Spawn the process with the parameters and options. We use the
  // --- `/bin/bash` option to ensure that process substitution works correctly.
  const childProcess = spawn(command, spawnParameters, {
    shell: shell ?? (sockets.length > 0 ? '/bin/bash' : undefined),
    stdio: ['pipe', 'pipe', 'inherit'],
    ...spawnOptions,
  })

  // --- Pass the input to the process and collect the output from stdout and stderr.
  if (stdin && childProcess.stdin) writeToStream(childProcess.stdin, stdin)
  const stdoutChunks: Buffer[] = []
  const stderrChunks: Buffer[] = []
  childProcess.stdout?.on('data', (data: Buffer) => stdoutChunks.push(data))
  childProcess.stderr?.on('data', (data: Buffer) => stderrChunks.push(data))

  // --- Handle errors and exit codes.
  childProcess.on('error', (error) => {
    for (const socket of sockets) socket.close()
    resolvable.reject(error)
  })

  childProcess.on('exit', (code) => {

    // --- If process substitution was used, close the sockets.
    for (const socket of sockets) socket.close()

    // --- The process exited successfully.
    if (code === 0) {
      const output = Buffer.concat(stdoutChunks)
      const result = encoding ? output.toString(encoding) : output
      return resolvable.resolve(result)
    }

    // --- The process was killed due to a timeout.
    if (code === null) {
      childProcess.kill()
      return resolvable.reject(new Error('Process timed out.'))
    }

    // --- The process exited with an error.
    const errorMessage = Buffer.concat(stderrChunks).toString('utf8') || `Process exited with code ${code}`
    const error = new Error(errorMessage)
    resolvable.reject(error)
  })

  // --- Return the awaitable promise.
  return awaitable(childProcess, resolvable)
}
