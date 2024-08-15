import type { Function } from '@unshared/types'
import type { TransferListItem } from 'node:worker_threads'
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

  // --- Destructure the request and get the function to call.
  const { name, parameters, port } = request
  const response: WorkerResponse = { error: undefined, value: undefined }
  const fn = WORKER_HANDLERS.get(name)

  // --- Send a heartbeat message to the worker.
  port.postMessage('heartbeat')

  // --- If the handler is registered, call it.
  if (fn) {
    try { response.value = await fn(...parameters) }
    catch (error) { response.error = error as Error }
  }

  // --- If the handler is not registered, send back an error.
  else { response.error = new Error(`Cannot execute handler: ${name} is not registered.`) }

  // --- If the result is a buffer, add it to the transfer list.
  const transferList: TransferListItem[] = Buffer.isBuffer(response.value) ? [response.value.buffer] : []
  port.postMessage(response, transferList)
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
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  if (WORKER_HANDLERS.size === 0) parentPort.addListener('message', requestCallback)
  WORKER_HANDLERS.set(name, callback)

  // --- Return a function to unregister the handler.
  return () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (WORKER_HANDLERS.size === 0) parentPort!.removeListener('message', requestCallback)
    WORKER_HANDLERS.delete(name)
  }
}

/* v8 ignore next */
if (import.meta.vitest) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { nextTick } = await import('node:process')
  const workerThreads = await import('node:worker_threads')
  type WorkerThreads = typeof workerThreads

  vi.mock('node:worker_threads', async() => {
    const workerThreads = await vi.importActual<WorkerThreads>('node:worker_threads')
    class MessagePortMock extends EventTarget {
      addListener(type: string, listener: Function<void>): void {

        // @ts-expect-error: event is expected to have a `data` property.
        super.addEventListener('message', (event: MessageEvent) => listener(event.data))
      }

      postMessage(data: unknown): void {
        const event = new MessageEvent('message', { data })
        super.dispatchEvent(event)
      }
    }
    const state = {
      isMainThread: false,
      parentPort: new MessagePortMock(),
    }
    return {
      ...workerThreads,
      get isMainThread() { return state.isMainThread },
      set isMainThread(value) { state.isMainThread = value },
      get parentPort() { return state.parentPort },
      set parentPort(value) { state.parentPort = value },
    }
  })

  beforeEach(() => {
    WORKER_HANDLERS.clear()
  })

  describe('registration', () => {
    it('should register a handler and store it in the global map', () => {
      const fn = () => {}
      workerRegister('foo', fn)
      expect(WORKER_HANDLERS).toHaveProperty('size', 1)
      expect(WORKER_HANDLERS.get('foo')).toBe(fn)
    })

    it('should unregister a handler and remove it from the global map', () => {
      const fn = () => {}
      const unregister = workerRegister('bar', fn)
      unregister()
      expect(WORKER_HANDLERS).toHaveProperty('size', 0)
    })
  })

  describe('request handling', () => {
    it('should call the callback when a message is received', async() => {
      const callback = vi.fn()
      const { port1 } = new MessageChannel()
      workerRegister('fn', callback)
      parentPort!.postMessage({ name: 'fn', parameters: [1, 2], port: port1 })
      await new Promise(nextTick)
      expect(callback).toHaveBeenCalledWith(1, 2)
    })

    it('should send a heartbeat message to the worker', async() => {
      const { port1, port2 } = new MessageChannel()
      workerRegister('fn', () => {})
      parentPort!.postMessage({ name: 'fn', parameters: [], port: port1 })
      const message = await new Promise<MessageEvent>(resolve => port2.addEventListener('message', resolve))
      expect(message.data).toBe('heartbeat')
    })

    it('should send the result of the function back to the worker', async() => {
      const { port1, port2 } = new MessageChannel()
      workerRegister('fn', (name: string) => `Hello, ${name}!`)
      parentPort!.postMessage({ name: 'fn', parameters: ['world'], port: port1 })
      const message = await new Promise<MessageEvent>((resolve) => {
        port2.addEventListener('message', (data) => {
          if (data.data !== 'heartbeat') resolve(data)
        })
      })
      expect(message.data).toStrictEqual({
        error: undefined,
        value: 'Hello, world!',
      })
    })

    it('should send an error back to the worker if the function throws', async() => {
      const { port1, port2 } = new MessageChannel()
      workerRegister('fn', () => { throw new Error('test') })
      parentPort!.postMessage({ name: 'fn', parameters: [], port: port1 })
      const message = await new Promise<MessageEvent>((resolve) => {
        port2.addEventListener('message', (data) => {
          if (data.data !== 'heartbeat') resolve(data)
        })
      })
      expect(message.data).toStrictEqual({
        error: new Error('test'),
        value: undefined,
      })
    })

    it('should send an error back to the worker if the function is not registered', async() => {
      const { port1, port2 } = new MessageChannel()
      parentPort!.postMessage({ name: 'fn', parameters: [], port: port1 })
      const message = await new Promise<MessageEvent>((resolve) => {
        port2.addEventListener('message', (data) => {
          if (data.data !== 'heartbeat') resolve(data)
        })
      })
      expect(message.data).toStrictEqual({
        error: new Error('Cannot execute handler: fn is not registered.'),
        value: undefined,
      })
    })
  })

  describe('isMainThread', () => {
    it('should throw an error if parentPort is not defined', () => {
    // eslint-disable-next-line unicorn/no-null
      workerThreads.parentPort = null
      const shouldThrow = () => workerRegister('add', () => {})
      expect(shouldThrow).toThrow('Cannot register handler: parentPort is not defined.')
    })

    it('should throw an error if workerRegister is called in the main thread', () => {
      workerThreads.isMainThread = true
      const shouldThrow = () => workerRegister('add', () => {})
      expect(shouldThrow).toThrow('Cannot register handler: workerRegister must be called in a worker thread.')
    })
  })

  describe.sequential('e2e', { retry: 3, timeout: 100 }, () => {
    const url = new URL('__fixtures__/handlers', import.meta.url).pathname
    const worker = new workerThreads.Worker(url)
    const send = (name: string, parameters: unknown[]) => {
      const { port1, port2 } = new MessageChannel()
      worker.postMessage({ name, parameters, port: port1 }, [port1 as unknown as TransferListItem])
      return new Promise((resolve, reject) => {
        port2.addEventListener('error', reject)
        port2.addEventListener('message', (response) => {
          if (response.data === 'heartbeat') return
          resolve(response.data as WorkerResponse<number>)
        })
      })
    }

    it('should handle message when in a worker thread and return the result', async() => {
      const response = await send('factorial', [5])
      expect(response).toStrictEqual({
        error: undefined,
        value: 120,
      })
    })

    it('should handle message when in a worker thread and return an promise value', async() => {
      const response = await send('factorialAsync', [5])
      expect(response).toStrictEqual({
        error: undefined,
        value: 120,
      })
    })

    it('should handle message when in a worker thread and return an error', async() => {
      const response = await send('throws', [])
      expect(response).toStrictEqual({
        error: new SyntaxError('Thrown'),
        value: undefined,
      })
    })

    it('should handle message when in a worker thread and return a rejected promise', async() => {
      const response = await send('rejects', [])
      expect(response).toStrictEqual({
        error: new SyntaxError('Rejected'),
        value: undefined,
      })
    })

    it('should handle message when in a worker thread and return a buffer', async() => {
      const response = await send('buffer', [])
      expect(response).toStrictEqual({
        error: undefined,
        value: Uint8Array.from(Buffer.from('Hello, World!')),
      })
    })

    it('should handle message when in a worker thread and return the thread ID', async() => {
      const response = await send('threadId', [])
      expect(response).toStrictEqual({
        error: undefined,
        value: worker.threadId,
      })
    })
  })
}
