import { Worker, WorkerOptions } from 'node:worker_threads'
import { awaitable } from '@unshared/functions/awaitable'
import { CallParameters, CallReturnType } from './utils/call'
import { IPCPayload } from './ipcHandle'

export interface IPCCallOptions<P extends unknown[] = unknown[]> extends WorkerOptions {
  /**
   * The path to the worker thread. This can be a string or a `URL` object. It is recommended
   * to pass a `URL` object to ensure the path is resolved and bundled correctly.
   *
   * @example new URL('./worker.ts', import.meta.url)
   */
  path: string | URL
  /**
   * The name of the function to call. This must match the name of the function passed
   * to `ipcExpose` in the worker thread.
   *
   * @example 'add'
   */
  name?: string | symbol
  /**
   * The parameters to pass to the function. These will be passed to the function in the
   * same order as they are specified here.
   *
   * @example [1, 2] // Will be passed to the function as fn(1, 2)
   */
  parameters?: P
  /**
   * Timeout in milliseconds before the call is rejected. If not specified, the call will
   * never timeout. It is recommended to set a timeout to prevent the call from hanging
   * indefinitely if the worker thread is not responding.
   *
   * @example 1000
   */
  timeout?: number
}

/**
 * Call an exposed function in a worker thread. To expose a function in a worker thread,
 * use the `ipcExpose` function.
 *
 * To allow type inference, it is recommended to pass the module's type and export key as generic
 * parameters. This will allow the function to infer the parameters and return type of the function
 * you are calling.
 *
 * Usually when transpilling, all dependencies are resolved by detecting the `import` and `require` statements.
 * However, since this function dynamically imports a module, the transpiler is not be able to detect
 * it as a dependency and will not bundle it. To handle such cases, you can use the ESBuild's plugin
 * [`@chialab/esbuild-plugin-meta-url`](https://www.npmjs.com/package/@chialab/esbuild-plugin-meta-url)
 * and pass a `URL` object as the module ID. This will allow the transpiler to resolve the module
 * correctly and bundle it in a separate file.
 *
 * @param id The module to import.
 * @param name The name of the exposed function to call.
 * @param args If the export is a function, these are the arguments to pass to the function.
 * @returns A promise that resolves with the result of the function.
 * @example
 * // math.worker.ts
 * ipcHandle('hash', (a: number, b: number) => a + b)
 *
 * // main.ts
 * const Math = typeof import('./math.worker.ts')
 * const mathUrl = new URL('./math.worker.ts', import.meta.url)
 * const result = await ipcCall<Math, 'add'>(mathUrl, 'add', 1, 2) // 3
 */
export function ipcCall<T extends object, K extends keyof T & string>(id: string | URL, name: K, ...args: CallParameters<T, K>): CallReturnType<T, K>
export function ipcCall<T extends object>(id: string | URL, name: 'default' | undefined, ...args: CallParameters<T, 'default'>): CallReturnType<T, 'default'>
export function ipcCall<T extends object>(id: string | URL, name: keyof T & string, ...args: unknown[]): Promise<unknown>
export function ipcCall<T extends object>(id: string | URL): CallReturnType<T, 'default'>
export function ipcCall(...args: unknown[]): Promise<unknown> {
  // --- Destructure and default options
  const isCallOptions
    = typeof args[0] === 'object'
    && args[0] !== null
    && args[0] instanceof URL === false
  const options = isCallOptions
    ? args[0] as IPCCallOptions
    : { 

  // --- Handle edge cases
  if (path instanceof URL === false && typeof path !== 'string')
    throw new TypeError('Expected the path to be a string or URL')
  if (typeof name !== 'string')
    throw new TypeError('Expected the name to be a string')
  if (Array.isArray(parameters) === false)
    throw new TypeError('Expected the parameters to be an array')
  if (typeof timeout !== 'number')
    throw new TypeError('Expected the timeout to be a number')
  if (timeout < 0)
    throw new RangeError('Expected the timeout to be a positive number')

  // --- Add the TSX loader if the worker is a TypeScript file.
  const execArgv = [
    '--no-warnings',
    ...process.execArgv,
    ...workerOptions.execArgv ?? [],
  ]

  // --- Create the worker and resolve on the first message or error.
  const worker = new Worker(path, {
    execArgv,
    workerData: { name, parameters },
    ...workerOptions,
  })

  // --- Await the first message or error and return the result.
  const result = new Promise((resolve, reject) => {
    // --- Handle the timeout.
    if (timeout > 0) setTimeout(reject, timeout, new Error(`IPC call timed out after ${timeout}ms`))

    // --- Handle the first message or error.
    worker.prependOnceListener('error', error => reject(error))
    worker.prependOnceListener('message', ({ value, error }: IPCPayload) => (error ? reject(error) : resolve(value)))
  })

  // --- Return the result as an awaitable of the worker that resolves to the result.
  return awaitable(worker, result)
}

if (import.meta.vitest) {
  const workerHashPath = new URL('__fixtures__/workerCrypto.ts', import.meta.url)
  const workerModulePath = new URL('__fixtures__/workerModule.ts', import.meta.url)

  it('should call a function if the name matches', async() => {
    const hash = await ipcCall(workerHashPath, 'random')
    expect(hash).toBeTypeOf('number')
    expectTypeOf(hash).toEqualTypeOf<unknown>()
  })

  it('should call a function if the name matches with parameters', async() => {
    const hash = await ipcCall<string>(workerHashPath, 'hash', 'md5', 'Hello, world!')
    expect(hash).toEqual('6cd3556deb0da54bca060b4c39479839')
    expectTypeOf(hash).toEqualTypeOf<string>()
  })

  it('should call a function if the name matches with parameters and options', async() => {
    const hash = await ipcCall<string>(workerHashPath, { name: 'hash', parameters: ['md5', 'Hello, world!'] })
    expect(hash).toEqual('6cd3556deb0da54bca060b4c39479839')
    expectTypeOf(hash).toEqualTypeOf<string>()
  })

  it('should call a function exposed with `ipcExposeModule`', async() => {
    const hash = await ipcCall(workerModulePath, 'upperCase', 'hello, world!')
    expect(hash).toBeTypeOf('number')
    expectTypeOf(hash).toEqualTypeOf<unknown>()
  })

  it('should reject if timeout is reached', async() => {
    const shouldReject = ipcCall(workerHashPath, { name: 'doesNotExist', parameters: ['hello'], timeout: 1 })
    await expect(shouldReject).rejects.toThrow(Error)
  })
}
