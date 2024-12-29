import { Worker } from 'node:worker_threads'
import { workerRequest } from './workerRequest'

describe('workerRequest', () => {
  const url = new URL('__fixtures__/handlers.js', import.meta.url).pathname
  const worker = new Worker(url, { stderr: true, stdout: true })
  type Module = typeof import('./__fixtures__/module')

  describe('call', () => {
    it('should return the process ID', async() => {
      const result = await workerRequest<Module['getThreadId']>(worker, { name: 'getThreadId' })
      expect(result).toStrictEqual(worker.threadId)
      expectTypeOf(result).toEqualTypeOf<number>()
    })

    it('should call the default handler if no name is provided', async() => {
      const result = await workerRequest<Module['default']>(worker)
      expect(result).toBe('DEFAULT')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should call a sync function if the name matches and return the result', async() => {
      const result = workerRequest<Module['factorial']>(worker, { name: 'factorial', parameters: [10] })
      await expect(result).resolves.toBe(3628800)
      expectTypeOf(result).toEqualTypeOf<Promise<number>>()
    })

    it('should call an async function if the name matches and return the resolved value', async() => {
      const result = workerRequest<Module['factorialAsync']>(worker, { name: 'factorialAsync', parameters: [10] })
      await expect(result).resolves.toBe(3628800)
      expectTypeOf(result).toEqualTypeOf<Promise<number>>()
    })
  })

  describe('transferrables', () => {
    it('should return Buffers as an Uint8Array', async() => {
      const result = await workerRequest<Module['buffer']>(worker, { name: 'buffer' })
      const expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33])
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result).toStrictEqual(expected)
    })

    it('should receive message in the worker thread', async() => {
      const { port1, port2 } = new MessageChannel()
      const result = workerRequest<Module['messageReceive']>(worker, { name: 'messageReceive', parameters: [port2] })
      port1.postMessage('Hello, World!')
      await expect(result).resolves.toBe('Hello, World!')
    })

    it('should send message from the worker thread', async() => {
      const { port1, port2 } = new MessageChannel()
      const result = workerRequest<Module['messageSend']>(worker, { name: 'messageSend', parameters: [port2] })
      port1.postMessage('Hello, World!')
      await expect(result).resolves.toBeUndefined()
    })

    it('should bi-directionally communicate between main and worker threads', async() => {
      const { port1, port2 } = new MessageChannel()
      const callback = vi.fn()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      port1.addEventListener('message', message => callback(message.data))
      const result = workerRequest<Module['messageEcho']>(worker, { name: 'messageEcho', parameters: [port2], timeout: 1000 })
      port1.postMessage('Hello, World!')
      await expect(result).resolves.toBe('Echo: Hello, World!')
      expect(callback).toHaveBeenCalledWith('Echo: Hello, World!')
    })
  })

  describe('edge cases', () => {
    it('should throw an error if the function does not exist', async() => {
      const shouldReject = workerRequest(worker, { name: 'doesNotExist' })
      await expect(shouldReject).rejects.toThrow('Cannot execute handler: doesNotExist is not registered.')
    })

    it('should throw an error if the function throws', async() => {
      const shouldReject = workerRequest(worker, { name: 'throws' })
      await expect(shouldReject).rejects.toThrow(SyntaxError)
      await expect(shouldReject).rejects.toThrow('Thrown')
    })

    it('should throw an error if the function rejects', async() => {
      const shouldReject = workerRequest(worker, { name: 'rejects' })
      await expect(shouldReject).rejects.toThrow(SyntaxError)
      await expect(shouldReject).rejects.toThrow('Rejected')
    })

    it('should reject if the worker does not respond', async() => {
      const urlEmpty = new URL('__fixtures__/empty.js', import.meta.url).pathname
      const workerEmpty = new Worker(urlEmpty, { stderr: true, stdout: true })
      const shouldReject = workerRequest(workerEmpty, { name: 'empty', timeout: 1 })
      await expect(shouldReject).rejects.toThrow('No registered handler is listening for messages.')
    })
  })
})
