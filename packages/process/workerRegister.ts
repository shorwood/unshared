/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable sonarjs/no-duplicate-string */
import { MessageChannel, MessagePort, TransferListItem, parentPort } from 'node:worker_threads'
import { Function } from '@unshared/types'
import { WorkerRequest } from './workerRequest'

/**
 * A common interface for the response of a `workerRequest` call. This is the payload
 * of the IPC message sent to the port specified in the request.
 */
export interface WorkerResponse<T = unknown, E = Error> {
  /** The value returned by the function. */
  value: T | undefined
  /** The error thrown by the function. */
  error: E | undefined
}

/** Options for registering a function to be called using worker threads messaging. */
export interface workerRegisterOptions {
  /**
   * The parent port to use for receiving messages. This is the port that the
   * function will be called on. This port must send messages of type `IPCRequest`.
   *
   * @default import('node:worker_threads').parentPort
   */
  port?: MessagePort
}

/** Unregister a function from being called using worker threads messaging. */
export type Unregister = () => void

// eslint-disable-next-line @typescript-eslint/ban-types
const registeredFunctions = new Map<string, Function>()

/**
 * Register a function that can be called using `node:worker_threads` messaging
 * events. Allowing you to organize the flow of your application in a more
 * modular way.
 *
 * @param name The name of the function to register.
 * @param callback The function to register.
 * @param options The options for registering the function.
 * @returns A function to unregister the function.
 * @example
 * // math.worker.ts
 * workerRegister('add', (a: number, b: number) => a + b)
 *
 * // main.ts
 * const workerPath = new URL('./math.worker.ts', import.meta.url)
 * const result = await workerRequest(workerPath, 'add', 1, 2) // 3
 */
export function workerRegister(name: string, callback: Function, options: workerRegisterOptions = {}): Unregister {
  const { port = parentPort } = options

  // --- Register the function.
  registeredFunctions.set(name, callback)

  // --- Declare the callback function.
  const requestCallback = async(request: WorkerRequest) => {

    // --- Check if the function is registered.
    const isRegistered = registeredFunctions.has(name)
    if (!isRegistered) {
      return request.port.postMessage({
        value: undefined,
        error: new Error(`Cannot execute registered function: ${name} is not registered.`),
      })
    }

    // --- Check if the request is for this function.
    if (request.name !== name) return

    // --- Call the callback and catch any errors.
    const response: WorkerResponse = { value: undefined, error: undefined }
    try { response.value = await callback(...request.parameters) }
    catch (error) { response.error = <Error>error }

    // --- If the result is a buffer, add it to the transfer list.
    const transferList: TransferListItem[] = []
    if (Buffer.isBuffer(response.value)) transferList.push(response.value.buffer)

    // --- Send result back to main thread
    request.port.postMessage(response, transferList)
  }

  // --- Register the handler.
  port!.on('message', requestCallback)

  // --- Return a function to unregister the handler.
  return () => {
    registeredFunctions.delete(name)
    port!.removeListener('message', requestCallback)
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  // Quick and dirty function to call a registered function.
  const call = (port: MessagePort, name: string, ...parameters: unknown[]) => new Promise((resolve) => {
    port.postMessage({ name, parameters })
    port.on('message', resolve)
  })

  it('should register a function that can be called from a message port', async() => {
    const { port1, port2 } = new MessageChannel()
    const callback = (name: string) => `Hello ${name}`
    workerRegister('hello', callback, { port: port2 })
    const result = await call(port1, 'hello', 'Jack')
    expect(result).toEqual({ value: 'Hello Jack', error: undefined })
  })

  it('should not be called when name does not match', async() => {
    const { port2 } = new MessageChannel()
    const callback = vi.fn()
    workerRegister('hello', callback, { port: port2 })
    await new Promise(resolve => setTimeout(resolve, 1))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should await the result of the callback', async() => {
    const { port1, port2 } = new MessageChannel()
    const callback = async(name: string) => `Hello ${name}`
    workerRegister('hello', callback, { port: port2 })
    const result = await call(port1, 'hello', 'Jack')
    expect(result).toEqual({ value: 'Hello Jack', error: undefined })
  })

  it('should post the error to the main thread', async() => {
    const { port1, port2 } = new MessageChannel()
    const error = new Error('test')
    const callback = () => { throw error }
    workerRegister('hello', callback, { port: port2 })
    const result = await call(port1, 'hello')
    expect(result).toEqual({ value: undefined, error })
  })

  it('should post the async error to the main thread', async() => {
    const { port1, port2 } = new MessageChannel()
    const error = new Error('test')
    const callback = () => Promise.reject(error)
    workerRegister('hello', callback, { port: port2 })
    const result = await call(port1, 'hello')
    expect(result).toEqual({ value: undefined, error })
  })

  it('should return buffers in the transfer list', async() => {
    const { port1, port2 } = new MessageChannel()
    const buffer = Buffer.from('test')
    const callback = () => buffer
    workerRegister('hello', callback, { port: port2 })
    const result = await call(port1, 'hello')
    expect(result).toEqual({ value: buffer, error: undefined })
  })
}
