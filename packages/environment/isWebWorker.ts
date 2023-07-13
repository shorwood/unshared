/**
 * Check if process is running in a Worker environment
 *
 * @returns `true` if process is running in a Worker
 */
export const isWorker = () => {
  // --- Detect on browser
  // @ts-expect-error: `WorkerGlobalScope` is not defined on Node.js
  if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    return true

  // --- Detect on Node.js
  if (typeof process !== 'undefined' && process.versions?.worker)
    return true

  // --- Detect on Deno
  // @ts-expect-error: `Deno` is not defined on Node.js
  if (typeof Deno !== 'undefined' && Deno?.core?.sharedQueue)
    return true

  // --- Detect on WebWorker
  return typeof importScripts === 'function'
}
