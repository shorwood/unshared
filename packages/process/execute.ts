/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
import { ChildProcess, SpawnOptions, spawn } from 'node:child_process'
import { Readable } from 'node:stream'
import { Awaitable, awaitable } from '@unshared/functions/awaitable'

/** Argument that can be passed to `execute`. */
export type SpawnArgument = Buffer | string

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
  stdin?: Buffer | Readable | string
  /**
   * The timeout to use for the process.
   *
   * @default 0
   * @example await execute("sleep", ["10"], { timeout: 1000 }) // Error: Process timed out.
   */
  timeout?: number
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
 * @param args The arguments to pass to the command.
 * @param options The encoding to use for the output or the options to use for the process.
 * @returns The output of the process.
 * @example
 * const a = Buffer.from("Hello, world!")
 * const b = Buffer.from("Hello, world?")
 * await execute("diff", [a, b]) // The diff output.
 */
export function execute(command: string, args: SpawnArgument[], options: ExecuteOptions<undefined>): Awaitable<ChildProcess, Buffer>
export function execute(command: string, args: SpawnArgument[], options: ExecuteOptions<BufferEncoding>): Awaitable<ChildProcess, string>
export function execute(command: string, args: SpawnArgument[], encoding: BufferEncoding): Awaitable<ChildProcess, string>
export function execute(command: string, args: SpawnArgument[]): Awaitable<ChildProcess, Buffer>
export function execute(command: string, args: SpawnArgument[], options: BufferEncoding | ExecuteOptions = {}): Awaitable<ChildProcess, Buffer | string> {
  if (typeof options === 'string') options = { encoding: options }
  const { encoding, stdin, timeout = 0, ...spawnOptions } = options

  // --- Substitute buffers so they emulate files.
  const finalArguments = args.map(argument => (Buffer.isBuffer(argument)
    ? `<(echo ${argument.toString('base64')} | base64 -d)`
    : argument))

  // --- Spawn the process.
  const process = spawn(command, finalArguments, {
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: '/bin/bash',
    ...spawnOptions,
  })

  // --- Pass the input to the process.
  if (typeof stdin === 'string' || Buffer.isBuffer(stdin)) {
    process.stdin!.write(stdin)
    process.stdin!.end()
  }
  else if (stdin instanceof Readable) {
    stdin.pipe(process.stdin!)
  }

  const createPromise = async() => await new Promise<Buffer | string>((resolve, reject) => {
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
    process.stdout?.on('data', data => stdoutChunks.push(data))
    process.stderr?.on('data', data => stderrChunks.push(data))
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

      // --- The process exited with an error.
      const errorMessage = Buffer.concat(stderrChunks).toString('utf8')
      const error = new Error(errorMessage)
      reject(error)
    })
  })

  // --- Return the awaitable promise.
  return awaitable(process, createPromise)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should spawn a process and return the output', async() => {
    const result = await execute('echo', ['Hello, world!'])
    const expected = Buffer.from('Hello, world!\n')
    expect(result).toEqual(expected)
    expectTypeOf(result).toEqualTypeOf<Buffer>()
  })

  // it('should spawn a process and return the output with a custom encoding', async() => {
  //   const result = await execute('echo', ['Hello, world!'], { encoding: 'base64' })
  //   const expected = Buffer.from('Hello, world!\n').toString('base64')
  //   expect(result).toEqual(expected)
  //   expectTypeOf(result).toEqualTypeOf<string>()
  // })

  // it('should spawn a process and pipe the input', async() => {
  //   const result = await execute('cat', [], { stdin: 'Hello, world!' })
  //   const expected = Buffer.from('Hello, world!')
  //   expect(result).toEqual(expected)
  //   expectTypeOf(result).toEqualTypeOf<Buffer>()
  // })

  // it('should substitute buffers for files', async() => {
  //   const result = await execute('cat', [Buffer.from('Hello, world!')])
  //   const expected = Buffer.from('Hello, world!')
  //   expect(result).toEqual(expected)
  //   expectTypeOf(result).toEqualTypeOf<Buffer>()
  // })

  // it('should reject if the process exits with a non-zero code', async() => {
  //   const shouldReject = execute('false', [])
  //   await expect(shouldReject).rejects.toThrow()
  // })

  // it('should kill the process if it takes too long', async() => {
  //   const shouldReject = execute('sleep', ['10'], { timeout: 1 })
  //   await expect(shouldReject).rejects.toThrow()
  // })
}
