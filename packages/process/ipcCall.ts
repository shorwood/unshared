/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable sonarjs/cognitive-complexity */
import { Worker, WorkerOptions } from 'node:worker_threads'

export type IPCPayload<T = unknown> =
  [value: T, error: undefined] |
  [value: undefined, error: Error]

export interface IPCCallOptions<P extends unknown[] = unknown[]> extends WorkerOptions {
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
 * Call a function located in a worker thread at the given path. This function must be
 * wrapped with `ipcCreate` in the worker thread. The function will be called with the
 * given arguments and the result will be returned.
 *
 * @param path The path to the worker thread.
 * @param options The options for the call.
 * @returns A promise that resolves with the result of the function.
 * @example ipcCall('./worker.js', 'add', 1, 2) // Promise<number>
 */
export async function ipcCall<T, P extends unknown[] = unknown[]>(path: string | URL, options: IPCCallOptions<P>): Promise<T>
/**
 * Call a function located in a worker thread at the given path. This function must be
 * wrapped with `ipcCreate` in the worker thread. The function will be called with the
 * given arguments and the result will be returned.
 *
 * @param path The path to the worker thread.
 * @param name The name of the function to call.
 * @param parameters The parameters to pass to the function.
 * @returns A promise that resolves with the result of the function.
 * @example ipcCall('./worker.js', 'add', 1, 2) // Promise<number>
 */
export async function ipcCall<T, P extends unknown[] = unknown[]>(path: string | URL, name: string, ...parameters: P): Promise<T>
export async function ipcCall(path: string | URL, ...args: any[]) {
  // --- Destructure and default options
  const options: IPCCallOptions = typeof args[0] === 'object' ? args[0] : { name: args[0], parameters: args.slice(1) }
  const { name, parameters = [], timeout = 0, ...workerOptions } = options

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
  const execArgv = [...process.execArgv, '--no-warnings']
  // const hasLoader = execArgv.some(argument => argument.startsWith('--loader='))
  // const pathExtension = path.toString().split('.').pop()
  // if (pathExtension === 'ts' && !hasLoader) {
  //   if (moduleExists('tsx')) execArgv.push('--loader=tsx')
  //   else if (moduleExists('ts-node')) execArgv.push('--loader=ts-node/esm')
  // }

  // --- Create the worker and resolve on the first message or error.
  const worker = new Worker(path, {
    execArgv,
    workerData: { name, parameters },
    ...workerOptions,
  })

  // --- Await the first message or error and return the result.
  return new Promise((resolve, reject) => {
    // --- Handle the timeout.
    if (timeout > 0) setTimeout(reject, timeout, new Error(`IPC call timed out after ${timeout}ms`))

    // --- Handle the first message or error.
    worker.prependOnceListener('error', error => reject(error))
    worker.prependOnceListener('message', ([value, error]: IPCPayload) => (error ? reject(error) : resolve(value)))
  })
}
