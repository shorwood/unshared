/* eslint-disable sonarjs/no-duplicate-string */
import { SpawnOptions, spawn } from 'node:child_process'

/** Argument that can be passed to `spawnAsync`. */
export type SpawnArgument = string | Buffer

export interface SpawnAsyncOptions<T extends BufferEncoding | undefined = BufferEncoding | undefined> extends SpawnOptions {
  /**
   * The encoding to use for the output.
   *
   * @example await spawnAsync("echo", ["Hello, world!"], { encoding: "base64" }) // "SGVsbG8sIHdvcmxkIQ=="
   */
  encoding?: T
  /**
   * The input to pipe to the process. If provided, the process will write this
   * value to `stdin` and then close it.
   *
   * @example await spawnAsync("echo", [], { pipe: "Hello, world!" }) // "Hello, world!"
   */
  pipe?: string | Buffer
  /**
   * The timeout to use for the process.
   *
   * @default 0
   * @example await spawnAsync("sleep", ["10"], { timeout: 1000 }) // Error: Process timed out.
   */
  timeout?: number
}

/**
 * Spawn a process and return the output. This function is similar to `child_process.spawn` but it
 * returns a promise that resolves with the output of the process. On top of that, it also supports
 * piping not only from `stdin` but also dynamically substitutes `Buffer` arguments for files using
 * the `<(echo ${buffer})` syntax. This is useful for passing binary data to processes that don't
 * support reading from `stdin`.
 *
 * @param command The command to spawn.
 * @param args The arguments to pass to the command. If a `Buffer` is passed, it will be substituted for using `<(echo ${buffer})`.
 * @param options The encoding to use for the output or the options to use for the process.
 * @returns The output of the process.
 * @example
 * const a = Buffer.from("Hello, world!")
 * const b = Buffer.from("Hello, world?")
 * await spawnAsync("diff", [a, b]) // The diff output.
 */
export async function spawnAsync(command: string, args: SpawnArgument[], options: SpawnAsyncOptions<undefined>): Promise<Buffer>
export async function spawnAsync(command: string, args: SpawnArgument[], options: SpawnAsyncOptions<BufferEncoding>): Promise<string>
export async function spawnAsync(command: string, args: SpawnArgument[], encoding: BufferEncoding): Promise<string>
export async function spawnAsync(command: string, args: SpawnArgument[]): Promise<Buffer>
export async function spawnAsync(command: string, args: SpawnArgument[], encodingOrOptions?: BufferEncoding | SpawnAsyncOptions): Promise<string | Buffer>
export async function spawnAsync(command: string, args: SpawnArgument[], encodingOrOptions: BufferEncoding | SpawnAsyncOptions = {}): Promise<string | Buffer> {
  // --- Normalize the options.
  if (typeof encodingOrOptions === 'string') encodingOrOptions = { encoding: encodingOrOptions }

  // --- Destructure the options.
  const options = typeof encodingOrOptions === 'string' ? { encoding: encodingOrOptions } : encodingOrOptions
  const { encoding, timeout = 0, pipe, ...spawnOptions } = options

  // --- Substitute buffers so they emulate files.
  const finalArguments = args.map(argument => (Buffer.isBuffer(argument)
    ? `<(echo ${argument.toString('base64')} | base64 -d)`
    : argument))

  const output = await new Promise<Buffer>((resolve, reject) => {
    const process = spawn(command, finalArguments, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: '/bin/bash',
      ...spawnOptions,
    })

    // --- Pipe the input to the process.
    if (pipe) {
      process.stdin?.write(pipe)
      process.stdin?.end()
    }

    // --- Kill the process if it takes too long.
    if (timeout > 0) {
      setTimeout(() => {
        process.kill('SIGABRT')
        reject(new Error('Process timed out.'))
      }, timeout)
    }

    // --- Collect the output.
    const chunks: Buffer[] = []
    process.stdout?.on('data', data => chunks.push(data))
    process.stdout?.on('end', () => resolve(Buffer.concat(chunks)))
    process.stdout?.on('error', reject)
  })

  // --- Return the output.
  return encoding
    ? output.toString(encoding)
    : output
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should spawn a process and return the output', async() => {
    const result = await spawnAsync('echo', ['Hello, world!'])
    const expected = Buffer.from('Hello, world!\n')
    expect(result).toEqual(expected)
    expectTypeOf(result).toEqualTypeOf<Buffer>()
  })

  it('should spawn a process and return the output with a custom encoding', async() => {
    const result = await spawnAsync('echo', ['Hello, world!'], { encoding: 'base64' })
    const expected = Buffer.from('Hello, world!\n').toString('base64')
    expect(result).toEqual(expected)
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  it('should spawn a process and pipe the input', async() => {
    const result = await spawnAsync('cat', [], { pipe: 'Hello, world!' })
    const expected = Buffer.from('Hello, world!')
    expect(result).toEqual(expected)
    expectTypeOf(result).toEqualTypeOf<Buffer>()
  })

  it('should substitute buffers for files', async() => {
    const result = await spawnAsync('cat', [Buffer.from('Hello, world!')])
    const expected = Buffer.from('Hello, world!')
    expect(result).toEqual(expected)
    expectTypeOf(result).toEqualTypeOf<Buffer>()
  })

  it('should kill the process if it takes too long', async() => {
    const shouldReject = spawnAsync('sleep', ['10'], { timeout: 1 })
    await expect(shouldReject).rejects.toThrow()
  })
}
