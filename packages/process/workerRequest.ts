import type { Function } from '@unshared/types'
import type { MessagePort, TransferListItem, Worker } from 'node:worker_threads'
import type { WorkerResponse } from './workerRegister'
import { isArrayBuffer, isArrayBufferView } from 'node:util/types'
import { MessageChannel } from 'node:worker_threads'

/**
 * The time in milliseconds to wait for a heartbeat message from the worker before
 * rejecting the request. This is used to ensure that the worker is still alive and
 * listening for messages.
 */
const WORKER_HEALTHCHECK_TIMEOUT = 500

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

  // --- Push any transferable objects to the transfer list.
  const transferList: TransferListItem[] = [port1]
  for (const parameter of parameters) {
    if (Buffer.isBuffer(parameter)) transferList.push(parameter.buffer)
    if (isArrayBufferView(parameter)) transferList.push(parameter.buffer)
    if (isArrayBuffer(parameter)) transferList.push(parameter)
  }

  // --- Wait for the response and resolve with the result or reject with the error.
  const result = await new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
    const error = new Error('No registered handler is listening for messages.')
    const timeout = setTimeout(reject, WORKER_HEALTHCHECK_TIMEOUT, error)
    port2.once('error', reject)
    port2.once('messageerror', reject)
    port2.addListener('message', (response: 'heartbeat' | WorkerResponse) => {
      if (response === 'heartbeat') return clearTimeout(timeout)
      const { error, value } = response
      if (error) reject(error)
      else resolve(value as Awaited<ReturnType<T>>)
    })

    // --- Send the request payload to the target worker.
    worker.postMessage({ name, parameters, port: port1 }, transferList)
  })

  // --- Return the result of the function.
  return result as Promise<Awaited<ReturnType<T>>>
}
