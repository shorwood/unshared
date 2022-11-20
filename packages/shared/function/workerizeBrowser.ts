/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable unicorn/prevent-abbreviations */

/**
 * Workerize a browser-side function so that it can be run in a separate thread.
 * @param callback The function to workerize
 * @return The workerized function
 * @example
 * const add = (a: number, b: number): number => a + b
 * const addWorkerized = workerizeBrowser(myFunction)
 * await addWorkerized(2, 3) // => 5
 * })
 */
export const workerizeBrowser = <T extends (...args: any) => any>(callback: T): (...args: Parameters<T>) => Promise<ReturnType<T>> => {
  const code = `
  import { parentPort, isMainThread, threadId, workerData } from 'worker_threads'
  if (isMainThread) throw new Error('Workerize can only be called from a Worker thread.')
  const run = (${callback.toString()})
  parentPort.on('message', data => {
    const result = run(data)
    parentPort.postMessage(result)
    process.exit()
  })`

  const blob = new Blob([code], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)

  // --- Instantiate the worker.
  const worker = new Worker(url, { name: callback.name, type: 'module' })
  const wrapped = (data: any) => new Promise((resolve, reject) => {
    worker.onmessage = event => resolve(event.data)
    worker.onerror = reject
    worker.postMessage(data)
  })

  // --- Return wrapped function
  return wrapped as any
}
