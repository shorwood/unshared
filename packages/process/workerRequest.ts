import type { Function } from '@unshared/types'
import type { Transferable, Worker } from 'node:worker_threads'
import type { WorkerResponse } from './workerRegister'
import { isArrayBuffer, isArrayBufferView } from 'node:util/types'
import { MessagePort } from 'node:worker_threads'
import { MessageChannel } from 'node:worker_threads'

/**
 * A common interface for the request passed to a `workerRegister` callback. This is
 * the payload of the IPC message received from the port specified in the request.
 */
export interface WorkerRequest<P extends unknown[] = unknown[]> {

  /**
   * The name of the handler to call. This is the name the handler was registered with.
   * This is used to identify which handler to call.
   */
  name: string

  /**
   * The parameters to pass to the handler. These are the parameters passed to the
   * `workerRequest` function.
   */
  parameters: P

  /**
   * The port to send the response to and receive the request from. This is the port
   * that will listen for messages from the `workerRequest` function.
   */
  port: MessagePort
}

/**
 * The options to pass to the `workerRequest` function. This is the payload of the IPC
 * message sent to the worker thread as well as some additional options.
 */
export interface WorkerRequestOptions<T extends Function = Function<unknown, unknown[]>> {

  /**
   * The name of the export to get from the module. If the named
   * export is a constant, it will be returned as is. If it is a
   * function, it will be called with the given parameters.
   *
   * @default 'default'
   * @example 'randomBytes'
   */
  name?: string

  /**
   * The parameters to pass to the target function as an array.
   *
   * @example [128]
   * @default []
   */
  parameters?: Parameters<T>

  /**
   * The channel that will be used to communicate with the worker thread. This is the
   * channel that will listen for messages from the `workerRequest` function.
   *
   * @default new MessageChannel()
   */
  channel?: MessageChannel

  /**
   * The transfer list to pass to the worker thread. This is an array of transferable
   * objects that will be transferred to the worker thread.
   *
   * @default []
   */
  transferList?: Transferable[]

  /**
   * The timeout in milliseconds to wait for a response from the worker before rejecting
   * the request. This is used to ensure that the worker is still alive and listening for
   * messages.
   *
   * @default 1000
   */
  timeout?: number
}

/**
 * Request a registered worker function to be called in a worker thread. This function
 * will post a request to the worker thread that will trigger the function registered
 * by the given `name` to be called. It will then await for the response message and
 * resolve with the result of the function.
 *
 * @param worker The `Worker` instance to request the function from.
 * @param options The options to call the registered function with.
 * @returns A promise that resolves with the result of the function.
 * @example
 * // math.worker.ts
 * workerRegister('add', (a: number, b: number) => a + b)
 *
 * // main.ts
 * const workerURL = new URL('./math.worker.ts', import.meta.url)
 * const result = await workerRequest(workerURL, 'add', 1, 2) // 3
 */
export async function workerRequest<T extends Function>(worker: Worker, options: WorkerRequestOptions<T> = {}): Promise<Awaited<ReturnType<T>>> {
  const { name = 'default', parameters = [], channel = new MessageChannel(), transferList = [], timeout = 1000 } = options
  const { port1, port2 } = channel

  // --- Push any transferable objects to the transfer list.
  for (const parameter of parameters) {
    if (parameter instanceof MessagePort) transferList.push(parameter)
    if (Buffer.isBuffer(parameter)) transferList.push(parameter.buffer as ArrayBuffer)
    if (isArrayBufferView(parameter)) transferList.push(parameter.buffer as ArrayBuffer)
    if (isArrayBuffer(parameter)) transferList.push(parameter)
  }

  // --- Wait for the response and resolve with the result or reject with the error.
  const result = await new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
    const error = new Error('No registered handler is listening for messages.')
    const timeoutInstnace = setTimeout(reject, timeout, error)
    port2.once('error', reject)
    port2.once('messageerror', reject)
    port2.addListener('message', (response: 'ping' | WorkerResponse) => {
      if (response === 'ping') return clearTimeout(timeoutInstnace)
      const { error, value } = response
      if (error) reject(error)
      else resolve(value as Awaited<ReturnType<T>>)
      clearTimeout(timeoutInstnace)
    })

    // --- Send the request payload to the target worker.
    worker.postMessage({ name, parameters, port: port1 }, [port1, ...transferList])
  })

  // --- Return the result of the function.
  return result as Promise<Awaited<ReturnType<T>>>
}
