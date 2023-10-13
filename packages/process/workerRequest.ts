/* eslint-disable sonarjs/no-duplicate-string */
import { MessageChannel, MessagePort, Worker } from 'node:worker_threads'
import { Function } from '@unshared/types'
import { WorkerResponse } from './workerRegister'

/**
 * A common interface for the request passed to a `workerRegister` callback. This is
 * the payload of the IPC message received from the port specified in the request.
 */
export interface WorkerRequest<P extends any[] = unknown[]> {
  /** The name of the function to call. */
  name: string
  /** The parameters to pass to the function. */
  parameters: P
  /** The port to send the response to. */
  port: MessagePort
}

/**
 * Request a registered worker function to be called in a worker thread. This function
 * will post a request to the worker thread that will trigger the function registered
 * by the given `name` to be called. It will then await for the response message and
 * resolve with the result of the function.
 *
 * @param worker The `Worker` instance to request the function from.
 * @param name The name the function was registered with.
 * @param parameters The parameters to pass to the function.
 * @returns A promise that resolves with the result of the function.
 * @example
 * // math.worker.ts
 * workerRegister('add', (a: number, b: number) => a + b)
 *
 * // main.ts
 * const workerURL = new URL('./math.worker.ts', import.meta.url)
 * const result = await workerRequest(workerURL, 'add', 1, 2) // 3
 */
export async function workerRequest<T extends Function>(worker: Worker, name: string, ...parameters: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
  const { port1, port2 } = new MessageChannel()
  const request: WorkerRequest = { name, parameters, port: port1 }
  worker.postMessage(request, [port1])

  // --- Wait for the response and resolve with the result or reject with the error.
  return await new Promise((resolve, reject) => {
    port2.once('messageerror', reject)
    port2.once('message', ({ error, value }: WorkerResponse) => (error ? reject(error) : resolve(value as Awaited<ReturnType<T>>)))
  })
}

/** c8 ignore next */
if (import.meta.vitest) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Module = typeof import('./__fixtures__/factorial.worker')
  const moduleUrl = new URL('__fixtures__/factorial.worker', import.meta.url).pathname
  const moduleWorker = new Worker(moduleUrl, { execArgv: ['--loader', 'tsx'] })

  it('should call a function if the name matches', async() => {
    const result = await workerRequest<Module['factorial']>(moduleWorker, 'factorial', 10)
    expect(result).toEqual(3628800)
    expectTypeOf(result).toEqualTypeOf<number>()
  })
}
