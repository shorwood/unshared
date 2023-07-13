/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable sonarjs/no-duplicate-string */
import { syncBuiltinESMExports } from 'node:module'
import { isMainThread, parentPort, workerData } from 'node:worker_threads'

export interface IPCPayload<T = unknown, E = Error> {
  /** The value returned by the function. */
  value: T | undefined
  /** The error thrown by the function. */
  error: E | undefined
}

/**
 * Expose a function so it can be called from the `ipcCall` function. When called, the this
 * function checks the `name` property of the `workerData` object to see if it matches the name
 * passed to this function. If it does, the function is called with the parameters passed
 * to `ipcCall` and the result is sent back to the main thread.
 *
 * If the `importMetaUrl` parameter is provided, will return a function that runs in a
 * worker thread. Otherwise, will return the function as-is.
 *
 * @param name The name of the function to expose.
 * @param callback The function to wrap and expose.
 * @example
 * // math.worker.ts
 * ipcHandle('add', (a: number, b: number) => a + b)
 *
 * // main.ts
 * const workerPath = new URL('./math.worker.ts', import.meta.url)
 * const result = await ipcCall(workerPath, 'add', 1, 2) // 3
 */
export async function ipcHandle<T extends Function>(name: string, callback: T): Promise<void> {
  if (typeof name !== 'string')
    throw new Error('Expected the exposed function to have a name')
  if (typeof callback !== 'function')
    throw new Error('Expected the exposed function to be a function')

  // --- Get worker data
  if (!isMainThread && workerData.name === name) {
    const result: IPCPayload = { value: undefined, error: undefined }
    try { result.value = await callback(...workerData.parameters) }
    catch (error) { result.error = <Error>error }

    // --- Bypass "unexpected message" error from Tinypool
    if (import.meta.vitest) Object.assign(result, { ready: true })

    // --- Send result back to main thread
    parentPort!.postMessage(result)
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  describe('in main thread', () => {
    beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
      const workerThreads = require('node:worker_threads')
      workerThreads.isMainThread = true
      workerThreads.workerData = { name: 'test', parameters: [] }
      syncBuiltinESMExports()
    })

    it('should not be called directly when in main thread', async() => {
      let called = false
      ipcHandle('test', () => { called = true })
      expect(called).toEqual(false)
    })
  })

  describe('in worker thread', () => {
    interface Context {
      messages: IPCPayload[]
    }

    beforeEach<Context>((context) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
      const workerThreads = require('node:worker_threads')
      context.messages = []
      workerThreads.isMainThread = false
      workerThreads.workerData = { name: 'test', parameters: [] }
      workerThreads.parentPort = { postMessage: (message: IPCPayload) => context.messages.push(message) }
      syncBuiltinESMExports()
    })

    it('should return a promise that resolves when the function is called', async() => {
      const result = ipcHandle('test', () => {})
      expect(result).resolves.toBeUndefined()
    })

    it('should be called directly when in worker thread', async() => {
      let called = false
      ipcHandle('test', () => { called = true })
      expect(called).toEqual(true)
    })

    it('should not be called when name does not match', async() => {
      let called = false
      ipcHandle('not-test', () => { called = true })
      expect(called).toEqual(false)
    })

    it<Context>('should post the result to the main thread', async({ messages }) => {
      await ipcHandle('test', () => 'test')
      expect(messages).toEqual([{ value: 'test', error: undefined, ready: true }])
    })

    it<Context>('should post the async result to the main thread', async({ messages }) => {
      await ipcHandle('test', () => Promise.resolve('test'))
      expect(messages).toEqual([{ value: 'test', error: undefined, ready: true }])
    })

    it<Context>('should post the error to the main thread', async({ messages }) => {
      const error = new Error('test')
      await ipcHandle('test', () => { throw error })
      expect(messages).toEqual([{ value: undefined, error, ready: true }])
    })

    it<Context>('should post the async error to the main thread', async({ messages }) => {
      const error = new Error('test')
      await ipcHandle('test', () => Promise.reject(error))
      expect(messages).toEqual([{ value: undefined, error, ready: true }])
    })

    it('should reject when name is not a string', async() => {
    // @ts-expect-error: invalid argument type
      const shouldReject = () => ipcHandle(1, () => {})
      expect(shouldReject).rejects.toThrowError(TypeError)
    })

    it('should reject when callback is not a function', async() => {
    // @ts-expect-error: invalid argument type
      const shouldReject = () => ipcHandle('test', 1)
      expect(shouldReject).rejects.toThrowError(TypeError)
    })
  })
}
