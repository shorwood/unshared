import { MessageChannel, MessagePort, TransferListItem, Worker } from 'node:worker_threads'
import { isArrayBuffer, isArrayBufferView } from 'node:util/types'
import { Function } from '@unshared/types'
import { WorkerResponse } from './workerRegister'

/**
 * The time in milliseconds to wait for a heartbeat message from the worker before
 * rejecting the request. This is used to ensure that the worker is still alive and
 * listening for messages.
 */
const WORKER_HEALTHCHECK_TIMEOUT = 1000

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

  // --- Compute the transfer list by filtering-in any `ArrayBuffer` or `MessagePort` objects.
  const transferList: TransferListItem[] = [port1]
  for (const parameter of parameters) {
    if (isArrayBufferView(parameter)) transferList.push(parameter.buffer)
    if (isArrayBuffer(parameter)) transferList.push(parameter)
  }

  // --- Post the request to the worker thread.
  worker.postMessage({ name, parameters, port: port1 }, transferList)

  // --- Wait for the response and resolve with the result or reject with the error.
  return await new Promise((resolve, reject) => {
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
  }) as Promise<Awaited<ReturnType<T>>>
}

/* v8 ignore next */
if (import.meta.vitest) {
  const urlHandlers = new URL('__fixtures__/handlers.js', import.meta.url).pathname
  const urlModules = new URL('__fixtures__/module.js', import.meta.url).pathname
  const workerHandlers = new Worker(urlHandlers, { stderr: true, stdout: true })
  const workerModules = new Worker(urlModules, { stderr: true, stdout: true })
  type Module = typeof import('./__fixtures__/module')

  test('should call a sync function if the name matches and return the result', async() => {
    const result = workerRequest<Module['factorial']>(workerHandlers, 'factorial', 10)
    await expect(result).resolves.toBe(3628800)
    expectTypeOf(result).toEqualTypeOf<Promise<number>>()
  })

  test('should call an async function if the name matches and return the resolved value', async() => {
    const result = workerRequest<Module['factorialAsync']>(workerHandlers, 'factorialAsync', 10)
    await expect(result).resolves.toBe(3628800)
    expectTypeOf(result).toEqualTypeOf<Promise<number>>()
  })

  test('should return Buffers as an Uint8Array', async() => {
    const result = await workerRequest<Module['buffer']>(workerHandlers, 'buffer')
    const expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33])
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result).toStrictEqual(expected)
  })

  test('should throw an error if the function does not exist', async() => {
    const shouldReject = workerRequest(workerHandlers, 'doesNotExist')
    await expect(shouldReject).rejects.toThrow('Cannot execute handler: doesNotExist is not registered.')
  })

  test('should throw an error if the function throws', async() => {
    const shouldReject = workerRequest(workerHandlers, 'throws')
    await expect(shouldReject).rejects.toThrow(SyntaxError)
    await expect(shouldReject).rejects.toThrow('Thrown')
  })

  test('should throw an error if the function rejects', async() => {
    const shouldReject = workerRequest(workerHandlers, 'rejects')
    await expect(shouldReject).rejects.toThrow(SyntaxError)
    await expect(shouldReject).rejects.toThrow('Rejected')
  })

  test('should return the process ID', async() => {
    const result = await workerRequest<Module['getThreadId']>(workerHandlers, 'threadId')
    expect(result).toStrictEqual(workerHandlers.threadId)
  })

  test('should reject if the worker does not respond', async() => {
    const shouldReject = workerRequest(workerModules, 'doesNotExist')
    await expect(shouldReject).rejects.toThrow('No registered handler is listening for messages.')
  })
}
