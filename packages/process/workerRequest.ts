import { MessageChannel, MessagePort, Worker } from 'node:worker_threads'
import { Function } from '@unshared/types'
import { WorkerResponse } from './workerRegister'

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
  worker.postMessage({ name, parameters, port: port1 }, [port1])

  // --- Wait for the response and resolve with the result or reject with the error.
  return await new Promise((resolve, reject) => {
    const timeoutError = new Error('No registered handler is listening for messages.')
    const timeout = setTimeout(() => reject(timeoutError), 10)

    port2.once('close', reject)
    port2.once('messageerror', reject)
    port2.on('message', (response: WorkerResponse | 'heartbeat') => {
      if (response === 'heartbeat') return clearTimeout(timeout)

      // --- Handle the response.
      const { error, value } = response
      if (error) reject(error)
      else resolve(value as Awaited<ReturnType<T>>)
    })
  })
}

/** c8 ignore next */
if (import.meta.vitest) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const workerHandlerUrl = new URL('__fixtures__/handlers.ts', import.meta.url).pathname
  const workerModuleUrl = new URL('__fixtures__/module.ts', import.meta.url).pathname
  const workerHandler = new Worker(workerHandlerUrl, { execArgv: ['--loader', 'tsx', '--no-warnings'] })
  const workerModule = new Worker(workerModuleUrl, { execArgv: ['--loader', 'tsx', '--no-warnings'] })

  // --- Wait for the worker to start.
  await new Promise(resolve => setTimeout(resolve, 100))

  it('should call a function if the name matches and return the result', () => {
    const result = workerRequest<(n: number) => number>(workerHandler, 'factorial', 10)
    expect(result).resolves.toEqual(3628800)
    expectTypeOf(result).toEqualTypeOf<Promise<number>>()
  })

  it('should return Buffers as an Uint8Array', async() => {
    const result = await workerRequest(workerHandler, 'buffer')
    expect(result).toBeInstanceOf(Uint8Array)
    const string = Buffer.from(<Uint8Array>result).toString()
    expect(string).toEqual('Hello, World!')
  })

  it('should throw an error if the function does not exist', () => {
    const shouldReject = workerRequest(workerHandler, 'doesNotExist')
    expect(shouldReject).rejects.toThrow()
  })

  it('should throw an error if the function throws', () => {
    const shouldReject = workerRequest(workerHandler, 'throws')
    expect(shouldReject).rejects.toThrow(SyntaxError)
  })

  it('should throw an error if the function rejects', () => {
    const shouldReject = workerRequest(workerHandler, 'rejects')
    expect(shouldReject).rejects.toThrow(SyntaxError)
  })

  it('should return the process ID', async() => {
    const result = await workerRequest(workerHandler, 'threadId')
    expect(result).toEqual(workerHandler.threadId)
  })

  it('should reject if the worker does not respond', () => {
    const shouldReject = workerRequest(workerModule, 'doesNotExist')
    expect(shouldReject).rejects.toThrow('No registered handler is listening for messages.')
  })
}
