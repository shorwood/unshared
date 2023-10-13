/* eslint-disable @typescript-eslint/ban-types */
import { MessagePort, TransferListItem, parentPort } from 'node:worker_threads'
import { Function } from './types'
import { WorkerRequest } from './workerRequest'

/** Unregister a function from being called using worker threads messaging. */
export type Unregister = () => void

/**
 * A common interface for the response of a `workerRequest` call. This is the payload
 * of the IPC message sent to the port specified in the request.
 */
export interface WorkerResponse<T = unknown, E = Error> {
  /**
   * The value returned from the function.
   *
   * @internal
   */
  value: T | undefined
  /**
   * If the function threw an error, this will be the error that was thrown.
   *
   * @internal
   */
  error: E | undefined
}

/** A map of registered functions. */
export const workerHandlers = new Map<string, Function>()

/**
 * Check if the given value is a `WorkerRequest`.
 *
 * @param value The value to assert.
 * @returns `true` if the value is a `WorkerRequest`, otherwise `false`.
 * @internal
 */
function isWorkerRequest(value: unknown): value is WorkerRequest {
  return typeof value === 'object'
  && value !== null
  && 'name' in value && typeof value.name === 'string'
  && 'port' in value && value.port instanceof MessagePort
  && 'parameters' in value && Array.isArray(value.parameters)
}

/**
 * Internal callback for handling messages sent from the `workerRequest` function. This
 * function will be called when a message is received on the port specified in the
 * `workerRequest` call.
 *
 * @param request The request sent from the `workerRequest` function.
 * @returns A promise that resolves with the result of the function.
 * @internal
 */
async function requestCallback(request: unknown) {
  if (!isWorkerRequest(request)) return

  // --- Destructure the request and get the function to call.
  const { name, parameters, port: responsePort } = request
  const response: WorkerResponse = { value: undefined, error: undefined }
  const fn = workerHandlers.get(name)

  // --- Send a heartbeat message to the worker.
  responsePort.postMessage('heartbeat')

  // --- If the handler is registered, call it.
  if (fn) {
    try { response.value = await fn(...parameters) }
    catch (error) { response.error = <Error>error }
  }

  // --- If the handler is not registered, send back an error.
  else { response.error = new Error(`Cannot execute handler: ${name} is not registered.`) }

  // --- If the result is a buffer, add it to the transfer list.
  const transferList: TransferListItem[] = Buffer.isBuffer(response.value) ? [response.value.buffer] : []
  responsePort.postMessage(response, transferList)
}

/**
 * Register a function that can be called using `node:worker_threads` messaging
 * events. Allowing you to organize the flow of your application in a more
 * modular way.
 *
 * @param name The name of the function to register.
 * @param callback The function to register.
 * @returns A function to unregister the function.
 * @example
 * // math.worker.ts
 * workerRegister('add', (a: number, b: number) => a + b)
 *
 * // main.ts
 * const workerPath = new URL('./math.worker.ts', import.meta.url)
 * const result = await workerRequest(workerPath, 'add', 1, 2) // 3
 */
export function workerRegister(name: string, callback: Function): Unregister {
  if (!parentPort) throw new Error('Cannot register handler: parentPort is not defined.')

  // --- Register and start listening for messages.
  if (workerHandlers.size === 0)
    parentPort!.on('message', requestCallback)
  workerHandlers.set(name, callback)

  // --- Return a function to unregister the handler.
  return () => {
    workerHandlers.delete(name)
    if (workerHandlers.size === 0)
      parentPort!.removeListener('message', requestCallback)
  }
}
