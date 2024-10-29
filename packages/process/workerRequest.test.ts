/* eslint-disable vitest/valid-describe-callback */
import { Worker } from 'node:worker_threads'
import { workerRequest } from './workerRequest'

describe.sequential('workerRequest', { retry: 3 }, () => {
  const url = new URL('__fixtures__/handlers.js', import.meta.url).pathname
  const worker = new Worker(url, { stderr: true, stdout: true })
  type Module = typeof import('./__fixtures__/module')

  it('should call a sync function if the name matches and return the result', async() => {
    const result = workerRequest<Module['factorial']>(worker, 'factorial', 10)
    await expect(result).resolves.toBe(3628800)
    expectTypeOf(result).toEqualTypeOf<Promise<number>>()
  })

  it('should call an async function if the name matches and return the resolved value', async() => {
    const result = workerRequest<Module['factorialAsync']>(worker, 'factorialAsync', 10)
    await expect(result).resolves.toBe(3628800)
    expectTypeOf(result).toEqualTypeOf<Promise<number>>()
  })

  it('should throw an error if the function does not exist', async() => {
    const shouldReject = workerRequest(worker, 'doesNotExist')
    await expect(shouldReject).rejects.toThrow('Cannot execute handler: doesNotExist is not registered.')
  })

  it('should return Buffers as an Uint8Array', async() => {
    const result = await workerRequest<Module['buffer']>(worker, 'buffer')
    const expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33])
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result).toStrictEqual(expected)
  })

  it('should throw an error if the function throws', async() => {
    const shouldReject = workerRequest(worker, 'throws')
    await expect(shouldReject).rejects.toThrow(SyntaxError)
    await expect(shouldReject).rejects.toThrow('Thrown')
  })

  it('should throw an error if the function rejects', async() => {
    const shouldReject = workerRequest(worker, 'rejects')
    await expect(shouldReject).rejects.toThrow(SyntaxError)
    await expect(shouldReject).rejects.toThrow('Rejected')
  })

  it('should return the process ID', async() => {
    const result = await workerRequest<Module['getThreadId']>(worker, 'threadId')
    expect(result).toStrictEqual(worker.threadId)
  })

  it('should reject if the worker does not respond', async() => {
    const urlEmpty = new URL('__fixtures__/empty.js', import.meta.url).pathname
    const workerEmpty = new Worker(urlEmpty, { stderr: true, stdout: true })
    const shouldReject = workerRequest(workerEmpty, 'doesNotExist')
    await expect(shouldReject).rejects.toThrow('No registered handler is listening for messages.')
  })
})
