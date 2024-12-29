/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Function } from '@unshared/types'
import type { WorkerRequest } from './workerRequest'
import { isMainThread, MessagePort, parentPort } from 'node:worker_threads'

/** Unregister a function from being called using worker threads messaging. */
export type Unregister = () => void

/**
 * A common interface for the response of a `workerRequest` call. This is the payload
 * of the IPC message sent to the port specified in the request.
 */
export interface WorkerResponse<T = unknown, E = Error> {

  /**
   * If the function threw an error, this will be the error that was thrown.
   *
   * @internal
   */
  error: E | undefined

  /**
   * The value returned from the function.
   *
   * @internal
   */
  value: T | undefined
}

/** A map of registered functions. */
export const WORKER_HANDLERS = new Map<string, Function>()

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
async function requestCallback(request: WorkerRequest): Promise<void> {
  if (!isWorkerRequest(request)) return
  const { name, parameters, port } = request
  const fn = WORKER_HANDLERS.get(name)

  // --- Abort early if the function is not registered.
  if (!fn) {
    const error = new Error(`Cannot execute handler: ${name} is not registered.`)
    port.postMessage({ error })
  }

  // --- If the handler is registered, call it.
  try {
    port.postMessage('ping')
    const value = await fn!(...parameters) as unknown
    port.postMessage({ value })
  }
  catch (error) {
    port.postMessage({ error })
  }
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
  if (isMainThread) throw new Error('Cannot register handler: workerRegister must be called in a worker thread.')
  if (!parentPort) throw new Error('Cannot register handler: parentPort is not defined.')

  // --- Register and start listening for messages.
  if (WORKER_HANDLERS.size === 0) parentPort.addListener('message', requestCallback)
  WORKER_HANDLERS.set(name, callback)

  // --- Return a function to unregister the handler.
  return () => {
    WORKER_HANDLERS.delete(name)
    if (WORKER_HANDLERS.size === 0) parentPort!.removeListener('message', requestCallback)
  }
}
