import type { Function } from '@unshared/types'
import type { Transferable } from 'node:worker_threads'
import type { WorkerResponse } from './workerRegister'
import { parentPort } from 'node:worker_threads'
import workerThreads from 'node:worker_threads'
import { WORKER_HANDLERS, workerRegister } from './workerRegister'

describe('workerRegister', () => {
  vi.mock('node:worker_threads', async() => {
    const workerThreads = await vi.importActual('node:worker_threads')
    class MessagePortMock extends EventTarget {
      addListener(type: string, listener: Function<void>): void {
        // @ts-expect-error: event is expected to have a `data` property.
        super.addEventListener('message', (event: MessageEvent) => listener(event.data))
      }

      removeListener(type: string, listener: Function<void>): void {
        super.removeEventListener('message', listener)
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
      const fn = () => { /* noop */ }
      workerRegister('foo', fn)
      expect(WORKER_HANDLERS).toHaveProperty('size', 1)
      expect(WORKER_HANDLERS.get('foo')).toBe(fn)
    })

    it('should unregister a handler and remove it from the global map', () => {
      const fn = () => { /* noop */ }
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
      await new Promise(resolve => process.nextTick(resolve))
      expect(callback).toHaveBeenCalledWith(1, 2)
    })

    it('should send a ping message to the worker', async() => {
      const { port1, port2 } = new MessageChannel()
      workerRegister('fn', () => {})
      parentPort!.postMessage({ name: 'fn', parameters: [], port: port1 })
      const message = await new Promise<MessageEvent>(resolve => port2.addEventListener('message', resolve))
      expect(message.data).toBe('ping')
    })

    it('should send the result of the function back to the worker', async() => {
      const { port1, port2 } = new MessageChannel()
      workerRegister('fn', (name: string) => `Hello, ${name}!`)
      parentPort!.postMessage({ name: 'fn', parameters: ['world'], port: port1 })
      const message = await new Promise<MessageEvent>((resolve) => {
        port2.addEventListener('message', (data) => {
          if (data.data !== 'ping') resolve(data)
        })
      })
      expect(message.data).toStrictEqual({
        value: 'Hello, world!',
      })
    })

    it('should send an error back to the worker if the function throws', async() => {
      const { port1, port2 } = new MessageChannel()
      workerRegister('fn', () => { throw new Error('test') })
      parentPort!.postMessage({ name: 'fn', parameters: [], port: port1 })
      const message = await new Promise<MessageEvent>((resolve) => {
        port2.addEventListener('message', (data) => {
          if (data.data !== 'ping') resolve(data)
        })
      })
      expect(message.data).toStrictEqual({
        error: new Error('test'),
      })
    })

    it('should send an error back to the worker if the function is not registered', async() => {
      const { port1, port2 } = new MessageChannel()
      parentPort!.postMessage({ name: 'fn', parameters: [], port: port1 })
      const message = await new Promise<MessageEvent>((resolve) => {
        port2.addEventListener('message', (data) => {
          if (data.data !== 'ping') resolve(data)
        })
      })
      expect(message.data).toStrictEqual({
        error: new Error('Cannot execute handler: fn is not registered.'),
      })
    })
  })

  describe('e2e', () => {
    const url = new URL('__fixtures__/handlers', import.meta.url).pathname
    const worker = new workerThreads.Worker(url)
    const send = (name: string, parameters: unknown[]) => {
      const { port1, port2 } = new MessageChannel()
      worker.postMessage({ name, parameters, port: port1 }, [port1 as unknown as Transferable])
      return new Promise((resolve, reject) => {
        port2.addEventListener('error', reject)
        port2.addEventListener('message', (response) => {
          if (response.data === 'ping') return
          resolve(response.data as WorkerResponse<number>)
        })
      })
    }

    it('should handle message when in a worker thread and return the result', async() => {
      const response = await send('factorial', [5])
      expect(response).toStrictEqual({
        value: 120,
      })
    })

    it('should handle message when in a worker thread and return an promise value', async() => {
      const response = await send('factorialAsync', [5])
      expect(response).toStrictEqual({
        value: 120,
      })
    })

    it('should handle message when in a worker thread and return an error', async() => {
      const response = await send('throws', [])
      expect(response).toStrictEqual({
        error: new SyntaxError('Thrown'),
      })
    })

    it('should handle message when in a worker thread and return a rejected promise', async() => {
      const response = await send('rejects', [])
      expect(response).toStrictEqual({
        error: new SyntaxError('Rejected'),
      })
    })

    it('should handle message when in a worker thread and return a buffer', async() => {
      const response = await send('buffer', [])
      expect(response).toStrictEqual({
        value: Uint8Array.from(Buffer.from('Hello, World!')),
      })
    })

    it('should handle message when in a worker thread and return the thread ID', async() => {
      const response = await send('getThreadId', [])
      expect(response).toStrictEqual({
        value: worker.threadId,
      })
    })
  })
})
