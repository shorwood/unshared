/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable unicorn/prevent-abbreviations */
import { requireSafe } from './requireSafe'

/**
 * Workerize a runtime function so that it can be run in a separate thread.
 * @param {T} callback The function to workerize
 * @returns {(...args: A[]) => Promise<R>} The workerized function
 * @example
 * // Define a function to run in a separate thread.
 * const myFunction = (a: number, b: number): number => a + b
 *
 * // workerize it.
 * const myWorkerizedFunction = workerizeBrowser(myFunction)
 *
 * // run it
 * myWorkerizedFunction(2, 3).then(result => {
 *   console.log(`Result is: ${result}`)
 * })
 */
export const workerizeNode = <T extends (...args: any) => any>(callback: T): (...args: Parameters<T>) => Promise<ReturnType<T>> => {
  const fs = requireSafe<typeof import('node:fs')>('node:fs')
  const os = requireSafe<typeof import('node:os')>('node:os')
  const path = requireSafe<typeof import('node:path')>('node:path')
  const workerThreads = requireSafe<typeof import('node:worker_threads')>('node:worker_threads')

  // --- Missing dependency.
  if (!fs) throw new Error('Cannot workerize function. Missing dependency "node:fs"')
  if (!os) throw new Error('Cannot workerize function. Missing dependency "node:os"')
  if (!path) throw new Error('Cannot workerize function. Missing dependency "node:path"')
  if (!workerThreads) throw new Error('Cannot workerize function. Missing dependency "node:worker_threads"')

  const { writeFileSync, rmSync } = fs
  const { tmpdir } = os
  const { join } = path
  const { Worker } = workerThreads

  const code = `
  import { parentPort, isMainThread, threadId, workerData } from 'worker_threads'
  if (isMainThread) throw new Error('Workerize can only be called from a Worker thread.')
  const run = (${callback.toString()})
  parentPort.on('message', data => {
    const result = run(data)
    parentPort.postMessage(result)
    process.exit()
  })`

  const filePath = `${join(tmpdir(), `worker-${new Date().getSeconds()}`)}.js`
  writeFileSync(filePath, code)

  // --- Instantiate the worker.
  const worker = new Worker(filePath)
  const wrapped = (data: any) => new Promise((resolve, reject) => {
    worker.addListener('message', resolve)
    worker.addListener('error', reject)
    worker.postMessage(data)
  })

  // --- Remove temporary script on exit.
  const exitHandler = () => rmSync(filePath)
  process.on('exit', exitHandler)
  process.on('SIGINT', exitHandler)
  process.on('SIGUSR1', exitHandler)
  process.on('SIGUSR2', exitHandler)
  process.on('uncaughtException', exitHandler)

  // --- Return wrapped function
  return wrapped as any
}
