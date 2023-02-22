/* eslint-disable sonarjs/no-duplicate-string */
import { isMainThread, parentPort, workerData } from 'node:worker_threads'

/**
 * Expose a function to be called from the `ipcCall` function. When called, the function
 * checks the `name` property of the `workerData` object to see if it matches the name
 * passed to this function. If it does, the function is called with the parameters passed
 * to `ipcCall` and the result is sent back to the main thread.
 *
 * @param name The name of the function to wrap.
 * @param fn The function to wrap.
 * @returns The function that was passed in.
 * @example
 * // math.worker.ts
 * ipcExpose('add', (a: number, b: number) => a + b)
 *
 * // main.ts
 * const workerPath = new URL('./math.worker.ts', import.meta.url)
 * const result = await ipcCall(workerPath, 'add', 1, 2) // 3
 */
export function ipcExpose<T extends Function>(name: string | symbol, fn: T): T {
  if (typeof name !== 'string')
    throw new Error('Expected the exposed function to have a name')
  if (typeof fn !== 'function')
    throw new Error('Expected the exposed function to be a function')

  // --- Get worker data
  if (!isMainThread && workerData.name === name) {
    try {
      // --- Call the function and post the result back to the main thread.
      const value = fn(...workerData.parameters)
      if (value instanceof Promise) {
        value.then(value => parentPort!.postMessage([value, undefined]))
        value.catch(error => parentPort!.postMessage([undefined, error]))
      }
      else { parentPort!.postMessage([value, undefined]) }
    }

    // --- On error, post the error back to the main thread.
    catch (error) { parentPort!.postMessage([undefined, error]) }
  }

  // --- Return the function as-is.
  return fn
}
