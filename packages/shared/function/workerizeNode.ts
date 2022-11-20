/* eslint-disable unicorn/prevent-abbreviations */
import { randomString } from '../crypto'

/**
 * Workerize a runtime function so that it can be run in a separate thread.
 * @param callback The function to workerize
 * @return The workerized function
 * @example
 * const add = (a: number, b: number): number => a + b
 * const addWorkerized = await workerizeNode(myFunction)
 * await addWorkerized(2, 3) // => 5
 */
export const workerizeNode = async<T extends (...args: any) => any>(callback: T): Promise<(...args: Parameters<T>) => Promise<ReturnType<T>>> => {
  const { writeFile, rm } = await import('node:fs/promises')
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const { Worker } = await import('node:worker_threads')

  const code = `
  import { parentPort, isMainThread, threadId, workerData } from 'worker_threads'
  if (isMainThread) throw new Error('Workerize can only be called from a Worker thread.')
  const run = (${callback.toString()})
  parentPort.on('message', async data => {
    const result = await run(data)
    parentPort.postMessage(result)
    process.exit()
  })`

  const fileName = `${randomString(16)}.js`
  const fileDir = tmpdir()
  const filePath = join(fileDir, fileName)
  await writeFile(filePath, code)

  // --- Instantiate the worker.
  const worker = new Worker(filePath)
  const wrapped = (data: any) => new Promise((resolve, reject) => {
    worker.addListener('message', resolve)
    worker.addListener('error', reject)
    worker.postMessage(data)
  })

  // --- Remove temporary script on exit.
  const exitHandler = () => rm(filePath)
  process.on('exit', exitHandler)
  process.on('SIGINT', exitHandler)
  process.on('SIGUSR1', exitHandler)
  process.on('SIGUSR2', exitHandler)
  process.on('uncaughtException', exitHandler)

  // --- Return wrapped function
  return wrapped as any
}
