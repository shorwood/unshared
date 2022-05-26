/* eslint-disable unicorn/prevent-abbreviations */
import { rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Worker } from 'node:worker_threads'

export interface Workerize {
  <T extends (...args: A[]) => R, A, R>(callback: T): (...args: A[]) => Promise<R>
}

/**
 * Wrap a function to make it run in its own thread.
 * @param { Function } callback The function to run in the worker thread
 * @returns The wrapped function
 */
export const workerize: Workerize = (callback: Function): any => {
  const code = `
  import { parentPort, isMainThread, threadId, workerData } from 'worker_threads'
  if (isMainThread) throw new Error('Workerize can only be called from a Worker thread.')
  const run = (${callback.toString()})
  parentPort.on('message', data => {
    const result = run(data)
    parentPort.postMessage(result)
    process.exit()
  })`

  const filePath = `${join(tmpdir(), Math.random().toString(36).slice(2))}.js`
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

  return wrapped
}
