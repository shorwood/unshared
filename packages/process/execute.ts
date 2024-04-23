import { BinaryLike, toUint8Array } from '@unshared/binary/toUint8Array'
import { Awaitable, awaitable } from '@unshared/functions/awaitable'
import { Function } from '@unshared/types'
import { ChildProcess, SpawnOptions, spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { createServer } from 'node:net'
import { join } from 'node:path'
import { getuid } from 'node:process'
import { Readable, Writable } from 'node:stream'

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
  const { encoding, stdin, timeout = 0, ...spawnOptions } = options

  // --- If the argument is a buffer, write it to a temporary socket for IPC.
  const uid = getuid ? getuid().toString() : '0'
  const args = parameters.map((argument) => {
    if (typeof argument === 'string') return { arg: argument }

    // --- If the argument is some kind of binary data, we need to create
    // --- a temporary socket to pass the data to the process. This is done
    // --- by writing the data to the socket and then reading from it using
    // --- process substitution through the `nc` command.
    const uuid = randomBytes(16).toString('hex')
    const path = join('/run/user', uid, `${uuid}.sock`)
    const socket = createServer()
    socket.maxConnections = 1000
    socket.listen(path)
    socket.once('connection', socket => writeToStream(socket, argument))
    return {
      arg: `<(echo | nc -U ${path})`,
      data: argument,
      socket,
    }
  })

  // --- Spawn the process.
  const argsArray = args.map(({ arg }) => arg)
  const process = spawn(command, argsArray, {
    stdio: 'pipe',
    shell: '/bin/bash',
    ...spawnOptions,
  })

  // --- Pass the input to the process.
  if (stdin && process.stdin) writeToStream(process.stdin, stdin)

  const createPromise = () => new Promise<Buffer | string>((resolve, reject) => {

    // --- Kill the process if it takes too long.
    if (timeout > 0) {
      setTimeout(() => {
        process.kill('SIGABRT')
        reject(new Error('Process timed out.'))
      }, timeout)
    }

    // --- Collect the output.
    const stdoutChunks: Buffer[] = []
    const stderrChunks: Buffer[] = []
    process.stdout?.on('data', (data: Buffer) => stdoutChunks.push(data))
    process.stderr?.on('data', (data: Buffer) => stderrChunks.push(data))
    process.stdout?.on('error', reject)
    process.stderr?.on('error', reject)
    process.on('error', reject)

    // --- Handle the process exit.
    process.on('exit', (code) => {
      if (code === 0) {
        const output = Buffer.concat(stdoutChunks)
        const result = encoding ? output.toString(encoding) : output
        return resolve(result)
      }

      // --- If process substitution was used, close the sockets.
      for (const { socket } of args) if (socket) socket.close()

      // --- The process exited with an error.
      const errorMessage = Buffer.concat(stderrChunks).toString('utf8') || `Process exited with code ${code}`
      const error = new Error(errorMessage)
      reject(error)
    })
  })

  // --- Return the awaitable promise.
  return awaitable(process, createPromise)
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('execute', () => {
    it('should return a ChildProcess', () => {
      const process = execute('echo', ['Hello, world!'])
      expect(process).toBeInstanceOf(ChildProcess)
    })
  })

  describe('await', () => {
    it('should spawn a process and return the output as a buffer', { retry: 3 }, async() => {
      const result = await execute('echo', ['Hello, world!'])
      const string = result.toString('utf8')
      expect(string).toEqual('Hello, world!\n')
      expectTypeOf(result).toEqualTypeOf<Buffer>()
    })

    it('should spawn a process and return the output with a custom encoding', async() => {
      const result = await execute('echo', ['Hello, world!'], { encoding: 'base64' })
      expect(result).toEqual('SGVsbG8sIHdvcmxkIQo=')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should spawn a process and return the output with a custom encoding using shorthand', async() => {
      const result = await execute('echo', ['Hello, world!'], 'base64')
      expect(result).toEqual('SGVsbG8sIHdvcmxkIQo=')
      expectTypeOf(result).toEqualTypeOf<string>()
    })
  })

  describe('pipe', () => {
    it('should spawn a process and pipe a string to it', async() => {
      const result = await execute('cat', undefined, { stdin: 'Hello, world!' })
      const string = result.toString('utf8')
      expect(string).toEqual('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<Buffer>()
    })

    it('should spawn a process and pipe a buffer to it', async() => {
      const buffer = Buffer.from('Hello, world!')
      const result = await execute('cat', undefined, { stdin: buffer })
      const string = result.toString('utf8')
      expect(string).toEqual('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<Buffer>()
    })

    it('should spawn a process and pipe a stream to it', async() => {
      const stream = Readable.from(['Hello, world!'])
      const result = await execute('cat', undefined, { stdin: stream })
      const string = result.toString('utf8')
      expect(string).toEqual('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<Buffer>()
    })

    it('should write to the stdin of the process', async() => {
      const result = execute('cat', undefined, 'utf8')
      result.stdin?.write('Hello, world!')
      result.stdin?.end()
      await expect(result).resolves.toEqual('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<Awaitable<ChildProcess, string>>()
    })
  })

  describe('process substitution', () => {
    it('should handle Buffer arguments with process substitution', async() => {
      const buffer = Buffer.from('Hello, world!')
      const result = await execute('cat', [buffer], { encoding: 'utf8' })
      expect(result).toEqual('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should handle multiple Buffer arguments with process substitution', async() => {
      const a = Buffer.from('Hello')
      const b = Buffer.from(', world?')
      const result = await execute('cat', [a, b], { encoding: 'utf8' })
      expect(result).toEqual('Hello, world?')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should handle Readable arguments with process substitution', async() => {
      const stream = Readable.from(['Hello, world!'])
      const result = await execute('cat', [stream], { encoding: 'utf8' })
      expect(result).toEqual('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should handle Array<number> arguments with process substitution', async() => {
      const array = Uint8Array.from([0x48, 0x65, 0x6C, 0x6C, 0x6F])
      const result = await execute('cat', [array], { encoding: 'utf8' })
      expect(result).toEqual('Hello')
      expectTypeOf(result).toEqualTypeOf<string>()
    })
  })

  describe('error handling', () => {
    it('should reject if the process exits with a non-zero code', async() => {
      const shouldReject = async() => await execute('false', [])
      await expect(shouldReject).rejects.toThrow('Process exited with code 1')
    })

    it('should kill the process if it takes too long', async() => {
      const shouldReject = async() => await execute('sleep', ['10'], { timeout: 1 })
      await expect(shouldReject).rejects.toThrow('Process timed out.')
    })
  })
}
